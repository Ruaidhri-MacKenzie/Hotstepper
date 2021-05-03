export default class Patch {
	constructor(patch = {}) {
		this.name = patch.name || "";
		this.oscillatorType = patch.oscillatorType || "sine";
		this.filterType = patch.filterType || "lowpass";
		this.filterCutoff = patch.filterCutoff || 20000;
		this.filterResonance = patch.filterResonance || 1;
		this.lfoRate = patch.lfoRate || 0;
		this.lfoDepth = patch.lfoDepth || 0;
		this.envelopeAttack = patch.envelopeAttack || 0;
		this.envelopeDecay = patch.envelopeDecay || 0;
		this.envelopeSustain = patch.envelopeSustain || 1;
		this.envelopeRelease = patch.envelopeRelease || 0;
	}
}
