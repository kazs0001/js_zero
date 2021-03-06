
interface GameEvent {
    type: string;
    // author: Object;
    data?: Object;
}

class GameEventEmitter {
    private typeToListeners = new Map<string, Array<GameEventListener>>(); 

    private name: string;

    public addGameEventListener(listener: GameEventListener, type: string) {
        if (this.typeToListeners.has(type)) {
            this.typeToListeners.get(type)?.push(listener);
        } else {
            this.typeToListeners.set(type, new Array<GameEventListener>(listener));
        }
    }

    public removeGameEventListener(listener: GameEventListener, type: string) {
        if(this.typeToListeners.has(type)) {
            const listeners = this.typeToListeners.get(type) as  Array<GameEventListener>;

            while (listeners.indexOf(listener, 0) > -1) {
                listeners.splice(listeners.indexOf(listener, 0), 1);
            }
        }
    }

    public emitEvent(event: GameEvent){
        console.log("Emitting event: ", event);
        const listeners = this.typeToListeners.get(event.type);
        listeners?.forEach(listener => {
            listener.onEvent(event);
        });
    }
}

interface GameEventListener {
    onEvent(event: GameEvent): void;
}

export {
    GameEvent,
    GameEventEmitter,
    GameEventListener
}