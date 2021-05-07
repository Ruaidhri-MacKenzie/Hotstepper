# Hotstepper

**Free web-based Sequencer and Synthesiser.**

_Ruaidhri MacKenzie 2021_

## Sequencer

A sequencer allows you to play sounds at set times. It can be programmed to play music by telling it what sounds to make and when to make them.

The sequencer is split into eight channels, each with a set of controls and a sequence of steps which can be toggled on or off. Each sequence of steps is divided by beat and by bar, with four steps per beat and four beats per bar. This means the sequencer plays in sixteenth notes, also called semiquavers.

The playback bar appears below the channels, containing controls for starting, pausing and stopping playback. It also has a tempo control for changing how quickly the sequencer plays. The higher the tempo the faster the sequencer will play.

Each channel has several controls:

| Control | Description                                                                                                                                       |
| ------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| Patch   | This is the sound that the channel makes. Drum samples are included by default but new patches can be created with the synthesiser.               |
| Pan     | This is how far to the left or right the sound will be played. This will only work if listening in stereo, and more easily heard with headphones. |
| Level   | This is the volume at which the channel will play.                                                                                                |
| Solo    | Mutes all other channels when active. Only one channel may be solo at a time.                                                                     |
| Mute    | Stops the channel from playing regardless of programmed steps.                                                                                    |

---

## Synthesiser

A synthesiser (synth) is a musical instrument which creates and shapes sound waves electronically rather than physically. Just as a microphone can convert sounds into electrical signals, and these signals can be converted back to sound with a speaker, we can instead create the electrical signals programmatically.

### Oscillator

The part that creates the wave is called the oscillator. It can create different waveforms at different frequencies. The frequency of the wave is the pitch of the note that we hear.

| Waveform | Description                                                                                                                                                                                                                                                                                              |
| -------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sine     | Smooth waves that have a very clear tone. The shape will look familiar as it has a classic wave shape, with rounded crests and troughs. Creates the basis for many sounds, particularly flutes.                                                                                                          |
| Square   | Digital waves that give a buzzing, distorted tone. These jump from the maximum value to the minimum and vice versa, without any gradient between. Also called a Pulse wave due to the pulsing nature of the crests and troughs.                                                                          |
| Triangle | A cross between a sine and square wave which gives a bright tone. These waves move linearly between the max and minimum values, giving the crests and troughs the appearance of triangles.                                                                                                               |
| Sawtooth | A cross between a square and triangle wave which gives a very bright, buzzing tone. The wave rises linearly from the minimum to the maximum, but then falls back immediately as would a square wave, creating a serrated sawtooth edge appearance. Can create a good approximation of brass instruments. |

---

### Frequency Filter

When the oscillator creates a waveform it is then fed into a frequency filter. Filters raise and lower the volume of particular frequencies, usually with a cutoff value which mutes all frequencies beyond the cutoff. This can be a powerful tool for shaping the wave we are producing, giving character to the standard wave we have created.

| Filter Type | Description                                                                                                                                                          |
| ----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lowpass     | Removes frequencies above the cutoff frequency. Only frequencies lower than the cutoff may pass through the filter. Resonance will boost frequencies at the cutoff.  |
| Highpass    | Removes frequencies below the cutoff frequency. Only frequencies higher than the cutoff may pass through the filter. Resonance will boost frequencies at the cutoff. |
| Bandpass    | Removes frequencies outside of a band around the cutoff frequency. Resonance will widen or narrow the band around the cutoff.                                        |

---

A lowpass filter with a cutoff of 0 will remove all frequencies and make no sound. The same is true for a highpass filter with a cutoff of 20000, as 20kHz is the threshold for most human hearing.

### Amplitude Envelope

The volume of the sound over time can be changed using an envelope. An envelope contains four values:

| Envelope Control | Description                                                                                                                                                                                                                        |
| ---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Attack           | Attack is the time it takes for the sound to reach maximum volume. The higher the attack, the longer the sound will take to fade in. This can be used to remove popping or percussive sounds.                                      |
| Decay            | Decay is the time it takes for the sound to go from the maximum volume to the sustain level. With the sustain set to 0 the decay can be use to create percussive sounds of varying lengths.                                        |
| Sustain          | Sustain is the level at which the volume will be held while the sound is still being played, after the attack and decay times. When lowered this allows for a more dynamic effect, similar to how a string is plucked or hammered. |
| Release          | Release is the time it takes for the sound to fade out after it is no longer being played. This is similar to the sustain pedal on a piano.                                                                                        |

---

### Low-Frequency Oscillator (LFO)

The final component in our simple synthesiser is an LFO. This is another oscillator, similar to the one we started with, however the wave it produces is not played itself. Rather it is used to modulate our original wave. When viewed on an oscilloscope this has a fractal effect, a wave of waves. When heard the effect is of a wobble or buzz to the sound, depending how fast and how large our LFO wave is. The physical equivalent would be a violin player wiggling their finger back and forth to create vibrato. The speed of the LFO would represent how fast the violinist wiggles their finger, and the depth represents how far they wiggle along the string in either direction.

### Master

Once our wave has been created and shaped it is passed to a master level which can amplify or attenuate our wave as a whole, changing the volume while maintaining the sound.

The final step is using this wave to move a set of speakers, turning our electrical signals into real sound waves that we can hear.

### Patches

As you can see even our simple synth has quite a few settings to tweak and keep track of. Most commercial synthesisers will have at least three separate oscillators for producing waves, multiple LFOs, additional effects, etc.

Synths have always been electronic, but before they were computerised these settings had to be manually input on a physical device. If you wanted to load a sound you had previously created you would need to reset all the dials by hand. In order to store lots of different sounds without remembering hundreds of settings this was done by placing a piece of paper with the controls cut out over the synth, the settings were then marked on the paper. This was called a patch, and the name has stuck into the digital age.

Settings can be saved as patches, and then loaded into the synth when required. This means we can store multiple settings that can be played simultaneously by multiple synths, such as with the sequencer.

Once you have created a sound you like, save it as a patch and give it a name. If you go to the sequencer you will now find the patch as an option under the patch selection of each channel.

If you'd rather a less programmatic approach you can use the on-screen keyboard to play different notes, or use your QWERTY keyboard. Holding shift will increase the pitch by an octave.
