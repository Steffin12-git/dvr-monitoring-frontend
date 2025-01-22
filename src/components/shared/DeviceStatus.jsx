export const isDeviceOnline = (
  latestHandshakeAt,
  referenceTime = new Date(),
  thresholdInMinutes = 5
) => {
  if (!latestHandshakeAt) {
    return false;
  }

  const lastHandshakeTime = new Date(latestHandshakeAt).getTime(); 
  const referenceTimestamp = referenceTime.getTime(); 

  const differenceInMinutes =
  Math.abs(referenceTimestamp - lastHandshakeTime) / (1000 * 60);
  
  return differenceInMinutes <= thresholdInMinutes;
};

