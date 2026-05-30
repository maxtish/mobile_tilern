import DeviceInfo from 'react-native-device-info';

export async function getDeviceDescription() {
  const brand = DeviceInfo.getBrand();
  const model = DeviceInfo.getModel();
  const systemName = DeviceInfo.getSystemName();
  const systemVersion = DeviceInfo.getSystemVersion();

  return `${brand} ${model} (${systemName} ${systemVersion})`;
}
