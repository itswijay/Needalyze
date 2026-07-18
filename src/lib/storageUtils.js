// Storage monitoring utility
export const getStorageUsage = () => {
  if (typeof window === "undefined") return null;
  
  try {
    let totalSize = 0;
    let itemCount = 0;
    const items = [];
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = (localStorage[key].length + key.length) * 2; // Rough estimate in bytes
        totalSize += size;
        itemCount++;
        
        items.push({
          key,
          size: (size / 1024).toFixed(2) + ' KB'
        });
      }
    }
    
    return {
      totalSize: (totalSize / 1024).toFixed(2) + ' KB',
      itemCount,
      items: items.sort((a, b) => parseFloat(b.size) - parseFloat(a.size))
    };
  } catch (error) {
    console.error("Error calculating storage usage:", error);
    return null;
  }
};

// Function to clear specific storage keys
export const clearStorageByPattern = (pattern) => {
  if (typeof window === "undefined") return;
  
  try {
    const keysToRemove = [];
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.match(pattern)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`Removed ${keysToRemove.length} items matching pattern:`, pattern);
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

// Function to get available storage space
export const getAvailableStorage = () => {
  if (typeof window === "undefined") return null;
  
  try {
    const testKey = '__storage_test__';
    let testData = 'x';
    let used = 0;
    
    // Test current usage
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    // Test maximum capacity. Bounded at 30 doublings (~1GB of test data,
    // far beyond any real browser quota) so this can't hang the main
    // thread indefinitely if a quota exception is ever not thrown.
    try {
      let iterations = 0;
      const maxIterations = 30;
      while (iterations < maxIterations) {
        localStorage.setItem(testKey, testData);
        testData += testData;
        iterations++;
      }
    } catch (e) {
      // Quota exceeded - expected, this is how we find the limit.
    } finally {
      localStorage.removeItem(testKey);
    }
    
    const maxCapacity = testData.length / 2 + used;
    
    return {
      used: (used / 1024).toFixed(2) + ' KB',
      total: (maxCapacity / 1024).toFixed(2) + ' KB',
      available: ((maxCapacity - used) / 1024).toFixed(2) + ' KB',
      usagePercent: ((used / maxCapacity) * 100).toFixed(1) + '%'
    };
  } catch (error) {
    console.error("Error checking available storage:", error);
    return null;
  }
};