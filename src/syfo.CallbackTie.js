//see tests for documentation
CallbackTie = function(cb, options) {
  var t = this;
  t.options = (typeof options == 'number') ? {waitFor: options} : options;
  if(!t.options) {t.options = {};}
  if(typeof t.options.waitFor == 'undefined') {t.options.waitFor = 0;}
  t.options.keepCalling = 0;
  t.cb = cb;
  t.timesWrapperCalled = 0;
  t.timesCallbackCalled = 0;
  
  t.wait = function() {
    return t.callbackWrapper;
  };

  t.callbackWrapper = function() {
    t.timesCalled++;

    if(t.timesWrapperCalled == t.options.waitFor ||
       t.keepCalling && (t.timeCalled > t.optionsWaitFor)) {
       t.cb.apply(self, arguments);
    }
  };
  
  t.queue = function() {
    t.options.waitFor++;
    return t.wait(arguments);
  };
};

