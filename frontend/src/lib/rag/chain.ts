import { RunnableSequence } from "@langchain/core/runnables";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { generateQueryEmbedding } from "@/lib/embeddings";
import { buildRagContext } from "@/lib/rag/context-builder";
import {
  formatEventsForContext,
  retrieveEventsForMessage,
} from "@/lib/rag/event-retriever";
import {
  resolveVisitedPlaceNames,
  retrievePlaces,
} from "@/lib/rag/retriever";
import { buildSystemPrompt } from "@/lib/prompts/system-prompt";
import type { PlaceDocument } from "@/types/place-document.types";
import type { EventDocument } from "@/types/event.types";
import type { ColombiaRegion } from "@/types/place.types";
import type { TravelProfile, UserDocument } from "@/types/user.types";

export interface RagPipelineInput {
  userId: string;
  userName: string;
  userMessage: string;
}

export interface RagPipelineOutput {
  systemPrompt: string;
  primaryPlaces: PlaceDocument[];
  secondaryPlaces: PlaceDocument[];
  matchedEvents: number;
}

interface RagContextState {
  user: UserDocument;
  userName: string;
  userMessage: string;
  queryEmbedding: number[];
  primaryPlaces: PlaceDocument[];
  secondaryPlaces: PlaceDocument[];
  visitedPlaceNames: string[];
  ragContext: string;
  systemPrompt: string;
}

async function loadUser(userId: string): Promise<UserDocument> {
  const db = await getDb();
  const user = await db.collection<UserDocument>("users").findOne({
    _id: new ObjectId(userId),
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (
    !user.travel_profile?.onboarding_completed ||
    user.travel_profile.primary_interests.length === 0
  ) {
    throw new Error("Onboarding incompleto");
  }

  return user;
}

/** Orquestación LangChain del pipeline RAG completo (retrieval + prompt) */
export async function runRagPipeline(
  input: RagPipelineInput,
): Promise<RagPipelineOutput> {
  const chain = RunnableSequence.from([
    async (state: RagPipelineInput) => {
      const user = await loadUser(state.userId);
      return {
        user,
        userName: state.userName,
        userMessage: state.userMessage,
      };
    },
    async (partial: Pick<RagContextState, "user" | "userName" | "userMessage">) => {
      const queryEmbedding = await generateQueryEmbedding(partial.userMessage);
      return { ...partial, queryEmbedding };
    },
    async (partial: Pick<
      RagContextState,
      "user" | "userName" | "userMessage" | "queryEmbedding"
    >) => {
      const db = await getDb();
      const profile = partial.user.travel_profile as TravelProfile;
      const excludeIds = partial.user.visited_places ?? [];

      const primaryPlaces = await retrievePlaces(
        db,
        partial.queryEmbedding,
        {
          regions: profile.primary_interests as ColombiaRegion[],
          excludeIds,
          limit: 10,
          numCandidates: 50,
        },
      );

      const secondaryPlaces = await retrievePlaces(
        db,
        partial.queryEmbedding,
        {
          regions: profile.secondary_interests as ColombiaRegion[],
          excludeIds,
          limit: 3,
          numCandidates: 20,
        },
      );

      const visitedPlaceNames = await resolveVisitedPlaceNames(
        db,
        excludeIds,
      );

      const profileRegions = [
        ...profile.primary_interests,
        ...profile.secondary_interests,
      ] as ColombiaRegion[];

      const events = await retrieveEventsForMessage(db, {
        userMessage: partial.userMessage,
        regions: profileRegions,
      });

      return {
        ...partial,
        primaryPlaces,
        secondaryPlaces,
        visitedPlaceNames,
        events,
      };
    },
    async (partial: Omit<RagContextState, "ragContext" | "systemPrompt"> & {
      events: EventDocument[];
    }) => {
      const eventEntries = formatEventsForContext(partial.events);

      const ragContext = buildRagContext({
        primaryPlaces: partial.primaryPlaces,
        secondaryPlaces: partial.secondaryPlaces,
        events: eventEntries,
      });

      const systemPrompt = buildSystemPrompt({
        userName: partial.userName,
        profile: partial.user.travel_profile as TravelProfile,
        visitedPlaceNames: partial.visitedPlaceNames,
        ragContext,
        hasMatchedEvents: partial.events.length > 0,
      });

      return {
        systemPrompt,
        primaryPlaces: partial.primaryPlaces,
        secondaryPlaces: partial.secondaryPlaces,
        matchedEvents: partial.events.length,
      };
    },
  ]);

  return chain.invoke(input);
}
