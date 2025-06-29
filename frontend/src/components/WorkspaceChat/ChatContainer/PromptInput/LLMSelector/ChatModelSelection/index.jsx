import useGetProviderModels, {
  DISABLED_PROVIDERS,
} from "@/hooks/useGetProvidersModels";
import { useTranslation } from "react-i18next";

export default function ChatModelSelection({
  provider,
  setHasChanges,
  selectedLLMModel,
  setSelectedLLMModel,
}) {
  const { defaultModels, customModels, loading } =
    useGetProviderModels(provider);
  const { t } = useTranslation();
  if (DISABLED_PROVIDERS.includes(provider)) return null;

  if (loading) {
    return (
      <div>
        <div className="flex flex-col">
          <label htmlFor="name" className="block input-label">
            {t("chat_window.workspace_llm_manager.available_models", {
              provider,
            })}
          </label>
          <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
            {t(
              "chat_window.workspace_llm_manager.available_models_description"
            )}
          </p>
        </div>
        <select
          required={true}
          disabled={true}
          className="border-theme-modal-border border border-solid bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- waiting for models --
          </option>
        </select>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          {t("chat_window.workspace_llm_manager.available_models", {
            provider,
          })}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("chat_window.workspace_llm_manager.available_models_description")}
        </p>
      </div>

      <select
        id="workspace-llm-model-select"
        required={true}
        value={selectedLLMModel}
        onChange={(e) => {
          setHasChanges(true);
          setSelectedLLMModel(e.target.value);
        }}
        className="border-theme-modal-border border border-solid bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
      >
        {defaultModels.length > 0 && (
          <optgroup label="General models">
            {defaultModels.map((model) => {
              return (
                <option
                  key={model}
                  value={model}
                  selected={selectedLLMModel === model}
                >
                  {model}
                </option>
              );
            })}
          </optgroup>
        )}
        {Array.isArray(customModels) && customModels.length > 0 && (
          <optgroup label="Discovered models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={selectedLLMModel === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
        {/* For providers like TogetherAi where we partition model by creator entity. */}
        {!Array.isArray(customModels) &&
          Object.keys(customModels).length > 0 && (
            <>
              {Object.entries(customModels).map(([organization, models]) => (
                <optgroup key={organization} label={organization}>
                  {models.map((model) => (
                    <option
                      key={model.id}
                      value={model.id}
                      selected={selectedLLMModel === model.id}
                    >
                      {model.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </>
          )}
      </select>
    </div>
  );
}
