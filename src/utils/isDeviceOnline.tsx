/**
 * Determines whether a device is online based on its latest handshake timestamp.
 *
 * @param {string} [latestHandshakeAt] - The timestamp of the device's last handshake in ISO format.
 * @param {Date} [referenceTime=new Date()] - The reference time to compare against (defaults to the current time).
 * @param {number} [thresholdInMinutes=5] - The threshold (in minutes) to consider the device as online.
 * @returns {boolean} - Returns `true` if the device is online, otherwise `false`.
 */
export const isDeviceOnline = (
    latestHandshakeAt?: string,
    referenceTime: Date = new Date(),
    thresholdInMinutes: number = 5
  ): boolean => {
    if (!latestHandshakeAt) return false;
  
    const lastHandshakeTime = new Date(latestHandshakeAt).getTime();
    const referenceTimestamp = referenceTime.getTime();
  
    const differenceInMinutes = Math.abs(referenceTimestamp - lastHandshakeTime) / (1000 * 60);
    return differenceInMinutes <= thresholdInMinutes;
  };
  