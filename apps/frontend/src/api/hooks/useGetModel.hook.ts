import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type {
  AiPresetResponse,
  AssignPresetResponse,
  GetModelDto,
} from "../generated";
import { getModel } from "../requests/ai.req";

export const useGetModel = (
  options?: Omit<
    UseMutationOptions<AssignPresetResponse, unknown, AiPresetResponse>,
    "mutationKey" | "mutationFn"
  >,
) =>
  useMutation({
    mutationKey: ["get-ai-model"],
    mutationFn: (preset: AiPresetResponse) =>
      getModel({ presetId: preset.id } as GetModelDto),
    ...options,
  });
