/**
 * DOM Mutation Visualizer
 * Highlights elements that are being modified in the DOM with a temporary blue border
 * to help identify performance issues caused by excessive re-renders.
 */
(function() {
    // Configuration
    const config = {
      borderColor: '#1E90FF', // Dodger blue
      borderWidth: '2px',
      borderStyle: 'solid',
      highlightDuration: 500, // milliseconds
      zIndex: 999999,
      ignoredSelectors: [
      ]
    };
  
    // Store timeouts for each element to allow proper cleanup
    const highlightTimeouts = new WeakMap();
  
    // Function to check if element should be ignored
    function shouldIgnoreElement(element) {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) {
   return true;
  }
  
      // Skip non-element nodes or very small elements
      if (element.offsetWidth < 5 || element.offsetHeight < 5) {
   return true;
  }
  
      // Skip elements matching ignore selectors
      return config.ignoredSelectors.some(selector => {
        try {
          return element.matches(selector);
        } catch {
          return false;
        }
      });
    }
  
    // Function to highlight an element with a blue border
    function highlightElement(element, color = config.borderColor) {
      if (shouldIgnoreElement(element)) {
   return;
  }
  
      // Clear any existing timeout for this element
      if (highlightTimeouts.has(element)) {
      //   clearTimeout(highlightTimeouts.get(element));
      return;
      }
  
      // Store original styles before applying highlight
      const originalOutline = element.style.outline;
      const originalOutlineOffset = element.style.outlineOffset;
      const originalPosition = element.style.position;
  
      // Apply highlight styles
      element.style.outline = `${config.borderWidth} ${config.borderStyle} ${color}`;
      element.style.outlineOffset = '-1px';
  
      // Ensure the outline is visible by checking position
      const computedPosition = getComputedStyle(element).position;
      if (computedPosition === 'static') {
        element.style.position = 'relative';
      }
  
      // Create timeout to remove highlight
      const timeoutId = setTimeout(() => {
        // Reset to original styles
        element.style.outline = originalOutline;
        element.style.outlineOffset = originalOutlineOffset;
        element.style.position = originalPosition;
  
        // Remove timeout reference
        highlightTimeouts.delete(element);
      }, config.highlightDuration);
  
      // Store the timeout ID
      highlightTimeouts.set(element, timeoutId);
    }
  
    // Process mutation records
    function processMutations(mutations) {
      mutations.forEach(mutation => {
        // For added nodes
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              highlightElement(node);
  
              // Also highlight child elements
              if (node.querySelectorAll) {
                node.querySelectorAll('*').forEach(child => {
                  highlightElement(child);
                });
              }
            }
          });
  
          // For removed nodes, highlight the parent
          if (mutation.removedNodes.length > 0) {
            highlightElement(mutation.target);
          }
        }
  
        // For attribute changes
        if (mutation.type === 'attributes') {
          if (mutation.attributeName !== 'style') {
              highlightElement(mutation.target, 'lightgrey');
          }
        }
  
        // For text changes
        if (mutation.type === 'characterData' && mutation.target.parentNode) {
          highlightElement(mutation.target.parentNode);
        }
      });
    }
  
    // Cleanup function to remove all highlights
    function removeAllHighlights() {
      // Use a temporary array because we can't iterate over WeakMap directly
      const elements = [];
      document.querySelectorAll('*').forEach(el => {
        if (highlightTimeouts.has(el)) {
          elements.push(el);
        }
      });
  
      elements.forEach(el => {
        clearTimeout(highlightTimeouts.get(el));
		if (!(el instanceof HTMLElement)) {
			return;
		}
        el.style.outline = '';
        el.style.outlineOffset = '';
        // Only reset position if we changed it (not a reliable way to check, but better than nothing)
        if (el.style.position === 'relative') {
          el.style.position = '';
        }
        highlightTimeouts.delete(el);
      });
    }
  
    let observer = null;
  
    // Initialize mutation observer
    function initMutationVisualizer() {
      if (observer) {
        // Already initialized
        return function() {
          observer.disconnect();
          removeAllHighlights();
          observer = null;
          console.log('DOM Mutation Visualizer deactivated');
        };
      }
  
      observer = new MutationObserver(processMutations);
  
      // Start observing the document
      observer.observe(document.documentElement, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
      });
  
      console.log('DOM Mutation Visualizer activated - mutations will be highlighted with blue borders');
  
      // Return a function to stop observing
      return function stopMutationVisualizer() {
        observer.disconnect();
        removeAllHighlights();
        observer = null;
        console.log('DOM Mutation Visualizer deactivated');
      };
    }
  
    // Expose the API to window for toggling from the console
    window.MutationVisualizer = {
      start: initMutationVisualizer,
      active: false,
      stop: null,
      toggle: function() {
        if (this.active) {
          if (typeof this.stop === 'function') {
   this.stop();
  }
          this.active = false;
          this.stop = null;
        } else {
          this.stop = this.start();
          this.active = true;
        }
        return this.active ? 'Visualizer started' : 'Visualizer stopped';
      },
      updateConfig: function(newConfig) {
        Object.assign(config, newConfig);
        console.log('Configuration updated:', config);
      }
    };
  
    // Auto-start if enabled via URL parameter (for easy toggling)
    if (window.location.search.includes('render-observer=true')) {
      window.MutationVisualizer.toggle();
    }
  
    // Listen for messages from the extension popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'getState') {
        sendResponse({ 
          isObserving: window.MutationVisualizer.active,
          config: config // Send the current config state
        });
      } else if (message.action === 'toggle') {
        if (message.isEnabled && !window.MutationVisualizer.active) {
          if (message.config) {
            window.MutationVisualizer.updateConfig(message.config);
          }
          window.MutationVisualizer.toggle();
        } else if (!message.isEnabled && window.MutationVisualizer.active) {
          window.MutationVisualizer.toggle();
        }
        
        sendResponse({ 
          status: 'success', 
          isObserving: window.MutationVisualizer.active 
        });
      } else if (message.action === 'updateConfig') {
        window.MutationVisualizer.updateConfig(message.config);
        sendResponse({ status: 'success' });
      }
      
      return true;
    });
  
    // Check URL against stored patterns
    chrome.storage.sync.get(['autoEnablePatterns'], (result) => {
      const patterns = result.autoEnablePatterns || [];
      const currentUrl = window.location.href;
      
      const shouldAutoEnable = patterns.some(pattern => {
        try {
          const regex = new RegExp(pattern);
          return regex.test(currentUrl);
        } catch {
          return false;
        }
      });
  
      if (shouldAutoEnable && !window.MutationVisualizer.active) {
        window.MutationVisualizer.toggle();
      }
    });
  })();