# Storage Optimization Strategies

## Current Issues:
1. **FormContext stores full form data in localStorage** on every change
2. **PDF generation creates high-quality canvas images** (scale: 2)
3. **Redundant storage** (database + localStorage)

## Solutions:

### 1. Implement Data Compression
```javascript
// Add to FormContext.jsx
const compressData = (data) => {
  return LZString.compress(JSON.stringify(data));
};

const decompressData = (compressedData) => {
  try {
    return JSON.parse(LZString.decompress(compressedData));
  } catch {
    return null;
  }
};
```

### 2. Reduce PDF Canvas Quality
```javascript
// In pdfGenerator.js - reduce scale from 2 to 1.5 or 1
const canvas = await html2canvas(element, {
  scale: 1, // Reduced from 2
  useCORS: true,
  allowTaint: false,
  backgroundColor: '#ffffff',
});
```

### 3. Selective Storage
```javascript
// Store only essential data in localStorage
const getEssentialData = (formData) => {
  return {
    step1: {
      fullName: formData.step1?.fullName,
      phoneNumber: formData.step1?.phoneNumber,
    },
    currentStep: formData.currentStep,
    linkId: formData.linkId
  };
};
```

### 4. Implement Storage Cleanup
```javascript
// Add storage cleanup utility
const cleanupStorage = () => {
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  const now = Date.now();
  
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('needalyze-')) {
      const data = JSON.parse(localStorage.getItem(key));
      if (data.timestamp && (now - data.timestamp) > maxAge) {
        localStorage.removeItem(key);
      }
    }
  });
};
```

### 5. Use sessionStorage for Temporary Data
```javascript
// Use sessionStorage for form drafts
const TEMP_STORAGE_KEY = 'needalyze-temp-form';
sessionStorage.setItem(TEMP_STORAGE_KEY, JSON.stringify(tempData));
```

### 6. Implement Debounced Saving
```javascript
// Add debounced saving to reduce write frequency
import { debounce } from 'lodash';

const debouncedSave = useCallback(
  debounce((data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, 1000),
  []
);
```

## Implementation Priority:
1. **Reduce PDF canvas scale** (immediate 50%+ reduction)
2. **Implement debounced saving** (reduce write frequency)
3. **Add data compression** (30-70% size reduction)
4. **Use sessionStorage for temporary data**
5. **Implement storage cleanup**