export const useSettings = () => {
  return {
    settings: [],
    loading: false,
    getSetting: () => null,
    getSettingValue: () => null,
    updateSetting: async (_key: string, _value: any, _category?: string) => {},
  };
};
