// FX Rack 

var freeverb = new Tone.Freeverb({
    roomSize: 0.5,
    dampening: 100
}).toMaster()

var filter = new Tone.Filter({
    "type": "lowpass",
    "frequency": 3000,
    "rolloff": -24,
    "Q": 1,
    "gain": 0
}).connect(freeverb)

var gainNode = Tone.context.createGain();
var env = new Tone.Envelope({
    "attack": 0.1,
    "decay": 0.5,
    "sustain": 1,
    "release": 0.8,
});
env.connect(gainNode.gain)

// Instruments 

var synth1 = new Tone.AMSynth({
	"modulationIndex": "modind",
	"oscillator": {
		"type": "sine"
	},
	"envelope": {
		"attack": 0.01,
		"decay": 0.2
	},
	"modulation": {
		"type": "sine",
		"frequency": 440,
		"detune": 0,
		"phase": 0
	},
	"modulationEnvelope" : {
		"attack": 0.2,
		"decay": 0.01
	}
}).toMaster();


var synth = new Tone.MonoSynth({
    "oscillator": {
        "type": "square"
    },
    "envelope": {
        "attack": 0.005,
        "decay": 0.2,
        "sustain": 0.1,
        "release": 1
    },
    "filterEnvelope": {
        "attack": 0.1,
        "decay": 0.5,
        "sustain": 0.1,
        "release": 2,
        "baseFrequency": 1000,
        "octaves": 7,
        "exponent": 2
    }
}).connect(filter)
synth.hold = false

// Transport setup
Tone.Transport.bpm.value = 120 // bar is exactly 2 seconds long

var tonesArray = []
var barSubdivision = 16
var barTimeLength = Tone.Transport.bpm.value / 60
var timeTrack

var seq = new Tone.Sequence(function (time, note) {
    synth.triggerAttackRelease(note, "8n", time);
}, [
    ["C11", "C11", "C11", "C11"],
    ["C11", "C11", "C11", "C11"],
    ["C11", "C11", "C11", "C11"],
    ["C11", "C11", "C11", "C11"]
], "4n")


Tone.Transport.start()
seq.start()

function triggerNote(tone, time) {
    timeTrack = Math.floor(time % barTimeLength * barSubdivision / barTimeLength)

    if (timeTrack <= 3) {
        seq.at(0).at(timeTrack % 4, tone)
    } else if (timeTrack >= 4 && timeTrack <= 7) {
        seq.at(1).at(timeTrack % 4, tone)
    } else if (timeTrack >= 8 && timeTrack <= 11) {
        seq.at(2).at(timeTrack % 4, tone)
    } else {
        seq.at(3).at(timeTrack % 4, tone)
    }
}