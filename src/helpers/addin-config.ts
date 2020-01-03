export interface ConfigInterface {
  gitHubUserName: string;
  defaultGistId: string;
}

export function getConfig(): ConfigInterface {
  const config: ConfigInterface = {
    gitHubUserName: "",
    defaultGistId: ""
  };

  config.gitHubUserName = Office.context.roamingSettings.get("gitHubUserName");
  config.defaultGistId = Office.context.roamingSettings.get("defaultGistId");

  return config;
}

export function setConfig(config: ConfigInterface, callback) {
  Office.context.roamingSettings.set("gitHubUserName", config.gitHubUserName);
  Office.context.roamingSettings.set("defaultGistId", config.defaultGistId);

  Office.context.roamingSettings.saveAsync(callback);
}
