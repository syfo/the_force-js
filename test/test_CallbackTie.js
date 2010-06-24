/* CRZ
  Must satisfy these examples

  1. Be able to specify a callback that will only execute after called X times
  
    cb = function(args) { //code to execute }
    tie = new CallbackTie(cb, 2);
    callbackableFunction(tie.cb());
    otherCallbackableFunction(tie.cb());
    
    And cb(args) is called only after both functions have fired their callbacks.

  2. Should be able to wait for less than all 
    cb = function(args) { //code to execute }
    tie = new CallbackTie(cb, 2);
    callbackableFunction(tie.cb());
    otherCallbackableFunction(tie.cb());
    anotherCallbackableFunction(tie.cb())
    
    And cb(args) is called only after 2 of the 3 functions have fired their callbacks.

  3. Shouldn't have to explicitly specify how many functions to wait for, in case you arent sure how many there will be;

    cb = function(args) { //code to execute }
    tie = new CallbackTie(cb);
    for(var i = 0; i<10; i++) {
      if(Math.random() < .5) {
        callbackableFunction(tie.queue());
      }
    }
    
    And cb(args) is called only after all callbacks have been fired, however many there were
      
  4. Also should accept options hash as second option, since options will be expanded in the future.

    tie = new CallbackTie(cb, 2);
    equalTie = new CallbackTie(cb, {waitFor: 2});
    
  5. Should be able to change options 
  
    tie = new CallbackTie(cb, 1);
    tie.waitFor = 2
    tie = callbackableFunction(tie.cb());
    tie = otherCallbackableFunction(tie.cb());
    
    And cb(args) is called only after both callbackableFunction and otherCallbackableFunction are finished
    
  6. Needs access to original callback
    tie = new CallbackTie(cb, 5);
    callbackableFunction(tie.originalCallback);
    
    And cb(args) is called by the callbackableFunction immediately. cb == tie.originalCallback.
  
  NOTES
  - This functionality most certainly exists in an existing library
  - namespace this somewhere? Syfo.CallbackTie?
  - Dunno if 'tie' is the right name, its more like a function waiting on a semaphore, but tie sounds good.
  - What is this called in other async UI libs for nonweb platforms?
  - tie.cb() or tie.cb? either tie.cb IS the function or .cb() returns a function. 
  - cb() is more flexible but will be easy to call wrongly... :/
  - should the tie.queue() invocation be the default? seems like thats more useful than specifying ahead of time.
  - so if you call callbackTie with no number, the waitFor = 0. when you .queue() it increments waitFor.
  - I smell thread safety problems.
  - really miss jquery's $.extend!
*/

//QUnit tests
CallbackableMock = function() {
  var t = this;
  t.cb = arguments[0];
  t.msg = arguments[1];
  
  t.trigger = function() {
    t.cb(t.msg);
  };
};

callback = function() { 
  
  throw new Error(arguments[0]);
};

$(function() {
  module("CallbackTie");
  test("will not fire on first, will fire on second", function() {
    var tie = new CallbackTie(callback, 2);
    var cm1 = new CallbackableMock(tie.wait(), 'cm1');
    var cm2 = new CallbackableMock(tie.wait(), 'cm2');
    
    var error = null;
    try {
      cm1.trigger();
      cm2.trigger();
    }
    catch(e) {
      error = e;
    }
    
    equal(error.message, 'cm2', 'uses queue(), called the second time');
  });

  test("do not have to specify how many callback invocations to wait for", function() {
    var tie = new CallbackTie(callback);
    var cm1 = new CallbackableMock(tie.queue(), 'cm1');
    var cm2 = new CallbackableMock(tie.queue(), 'cm2');
    
    var error = null;
    try {
      cm1.trigger();
      cm2.trigger();
    }
    catch(e) {
      error = e;
    }
    
    equal(error.message, 'cm2', 'uses queue(), called the second time');
  });
});
