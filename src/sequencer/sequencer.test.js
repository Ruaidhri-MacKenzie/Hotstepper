import Sequencer from "./sequencer.js";

console.log("Sequencer class: Testing...");

// Create a new instance of the sequencer class
const sequencer = new Sequencer();
console.assert(sequencer.channelList, "Channel list not created.");
console.assert(sequencer.channelList.length() === 0, "Channel list not empty when created.");

// Add a channel
sequencer.addChannel();
const channel1 = sequencer.channelList[0];
console.assert(sequencer.channelList.length() === 1, "Channel not added to channel list.");
console.assert(channel1.level === 75, "Channel created with non-default level value.");
console.assert(channel1.pan === 0, "Channel created with non-default pan value.");
console.assert(channel1.patch === "", "Channel created with incorrect patch name.");
console.assert(channel1.isMute === false, "Channel created with non-default mute setting.");
console.assert(channel1.isSolo === false, "Channel created with non-default solo setting.");
console.assert(channel1.sequence, "Sequence not added to channel.");

// Add a second channel and solo the first
sequencer.addChannel();
const channel2 = sequencer.channelList[1];
channel1.setSolo(true);
console.assert(channel1.isSolo === true, "Solo not set on channel.");

// Solo the second channel while the first is still solo
channel2.setSolo(true);
console.assert(channel1.isSolo === false, "Solo not turned off when another channel is solo.");

console.log("Sequencer class: Testing complete.");
