define([
	'pubsub',
], function(pubsub) {

	function CursorListener(id, keyToNext) {
		if (!id){
			throw "CursorListener needs id";
		}
		this.id = id;
		this.keyToNext = (typeof keyToNext !== "undefined") ? keyToNext : 'arrow'; // way to go to previous next, 'arrow' or 'tab', by default it's arrow
		this.initSubscribe();
	}

	/**
	 * Publish event after receiving dom events
	 */
	CursorListener.prototype.initSubscribe = function() {
		var fn;
		var cursorId = 'Cursor-' + this.id;
		var self = this;
		if (self.keyToNext === 'tab') {			
			$.subscribe('tab-key',function(el,inc){
				//TODO: NoteEdition is subscribed to this one, maybe it's the better solution, but not sure
				$.publish('Cursor-moveCursorByElement-' + self.id, inc);
			});
		}else{ //arrow
			$.subscribe('ctrl-leftright-arrows',function(el,inc){
				//TODO: NoteEdition is subscribed to this one, maybe it's the better solution, but not sure
				$.publish('Cursor-moveCursorByElement-' + self.id, inc);
			});
			$.subscribe('shift-leftright-arrows',function(el,inc){
				fn = 'expandSelected';
				$.publish(cursorId, [fn, inc]);
			});
			$.subscribe('leftright-arrows',function(el,inc){
				fn = 'moveCursor';
				$.publish(cursorId, [fn, inc]);
			});
			$.subscribe('shift-begin',function(el,inc){
				fn = 'expandSelected';
				$.publish(cursorId,[fn, -10000]);
			});
			$.subscribe('begin',function(el,inc){
				fn = 'setCursor';
				$.publish(cursorId, [fn, 0]);
			});
			$.subscribe('shift-end',function(el,inc){
				fn = 'expandSelected';
				$.publish(cursorId, [fn, 10000]);
			});
			$.subscribe('end',function(el,inc){
				fn = 'setCursor';
				$.publish(cursorId, [fn, 10000]);
			});
		}
	};

	return CursorListener;
});