export const MAX_SEQUENCE_LENGTH = 100000;

export const validateDNA = (sequence: string): { valid: boolean; error?: string } => {
  if (sequence.length > MAX_SEQUENCE_LENGTH) {
    return { valid: false, error: `Sequence exceeds maximum length of ${MAX_SEQUENCE_LENGTH} bases.` };
  }

  const invalidChars = sequence.toUpperCase().replace(/[ATGC]/g, '');
  if (invalidChars.length > 0) {
    return { valid: false, error: `Invalid nucleotides detected: ${Array.from(new Set(invalidChars)).join(', ')}. Only A, T, G, C are allowed.` };
  }

  return { valid: true };
};

export const countBases = (sequence: string) => {
  const bases = {
    A: 0,
    T: 0,
    G: 0,
    C: 0,
    Other: 0
  };

  for (const base of sequence.toUpperCase()) {
    if (base === 'A') bases.A++;
    else if (base === 'T') bases.T++;
    else if (base === 'G') bases.G++;
    else if (base === 'C') bases.C++;
    else bases.Other++;
  }

  return bases;
};

export const reverseComplement = (sequence: string) => {
  const complement: Record<string, string> = { 'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G' };
  return sequence
    .toUpperCase()
    .split('')
    .reverse()
    .map(base => complement[base] || base)
    .join('');
};

export const getBaseClass = (base: string) => {
  switch (base.toUpperCase()) {
    case 'A': return 'dna-a';
    case 'T': return 'dna-t';
    case 'G': return 'dna-g';
    case 'C': return 'dna-c';
    default: return '';
  }
};

// Codon to Amino Acid mapping
export const CODON_TABLE: Record<string, string> = {
  'ATA': 'Isoleucine', 'ATC': 'Isoleucine', 'ATT': 'Isoleucine', 'ATG': 'Methionine',
  'ACA': 'Threonine', 'ACC': 'Threonine', 'ACG': 'Threonine', 'ACT': 'Threonine',
  'AAC': 'Asparagine', 'AAT': 'Asparagine', 'AAA': 'Lysine', 'AAG': 'Lysine',
  'AGC': 'Serine', 'AGT': 'Serine', 'AGA': 'Arginine', 'AGG': 'Arginine',
  'CTA': 'Leucine', 'CTC': 'Leucine', 'CTG': 'Leucine', 'CTT': 'Leucine',
  'CCA': 'Proline', 'CCC': 'Proline', 'CCG': 'Proline', 'CCT': 'Proline',
  'CAC': 'Histidine', 'CAT': 'Histidine', 'CAA': 'Glutamine', 'CAG': 'Glutamine',
  'CGA': 'Arginine', 'CGC': 'Arginine', 'CGG': 'Arginine', 'CGT': 'Arginine',
  'GTA': 'Valine', 'GTC': 'Valine', 'GTG': 'Valine', 'GTT': 'Valine',
  'GCA': 'Alanine', 'GCC': 'Alanine', 'GCG': 'Alanine', 'GCT': 'Alanine',
  'GAC': 'Aspartic acid', 'GAT': 'Aspartic acid', 'GAA': 'Glutamic acid', 'GAG': 'Glutamic acid',
  'GGA': 'Glycine', 'GGC': 'Glycine', 'GGG': 'Glycine', 'GGT': 'Glycine',
  'TCA': 'Serine', 'TCC': 'Serine', 'TCG': 'Serine', 'TCT': 'Serine',
  'TTC': 'Phenylalanine', 'TTT': 'Phenylalanine', 'TTA': 'Leucine', 'TTG': 'Leucine',
  'TAC': 'Tyrosine', 'TAT': 'Tyrosine', 'TAA': 'Stop', 'TAG': 'Stop',
  'TGC': 'Cysteine', 'TGT': 'Cysteine', 'TGA': 'Stop', 'TGG': 'Tryptophan'
};

export const getAminoAcids = (sequence: string) => {
  const aminoAcids = [];

  for (let i = 0; i < sequence.length; i += 3) {
    const codon = sequence.substring(i, i + 3);
    if (codon.length === 3) {
      aminoAcids.push({
        codon,
        aminoAcid: CODON_TABLE[codon] || 'Unknown'
      });
    }
  }

  return aminoAcids;
};

export const compareSequences = (seq1: string, seq2: string) => {
  const comparison = [];
  let matchCount = 0;
  let mismatchCount = 0;

  for (let i = 0; i < Math.min(seq1.length, seq2.length); i++) {
    const base1 = seq1[i].toUpperCase();
    const base2 = seq2[i].toUpperCase();

    if (base1 === base2) {
      comparison.push({
        index: i + 1,
        base1,
        base2,
        result: 'Match'
      });
      matchCount++;
    } else {
      comparison.push({
        index: i + 1,
        base1,
        base2,
        result: 'Mismatch'
      });
      mismatchCount++;
    }
  }

  const similarityPercentage = Math.min(seq1.length, seq2.length) > 0
    ? (matchCount / Math.min(seq1.length, seq2.length)) * 100
    : 0;

  return {
    comparison,
    matchCount,
    mismatchCount,
    similarityPercentage: similarityPercentage.toFixed(2)
  };
};

export const formatSequence = (sequence: string, blockSize: number = 10) => {
  const result = [];
  for (let i = 0; i < sequence.length; i += blockSize) {
    result.push(sequence.substring(i, i + blockSize));
  }
  return result.join(' ');
};

// New feature: SNP Detection
export interface SNP {
  position: number;
  referenceBase: string;
  alternateBase: string;
}

export const findSNPs = (reference: string, sample: string): SNP[] => {
  const snps: SNP[] = [];

  for (let i = 0; i < Math.min(reference.length, sample.length); i++) {
    const refBase = reference[i].toUpperCase();
    const sampleBase = sample[i].toUpperCase();

    if (refBase !== sampleBase &&
      ['A', 'T', 'G', 'C'].includes(refBase) &&
      ['A', 'T', 'G', 'C'].includes(sampleBase)) {
      snps.push({
        position: i + 1,
        referenceBase: refBase,
        alternateBase: sampleBase
      });
    }
  }

  return snps;
};

// New feature: Motif Search
export interface MotifMatch {
  position: number;
  sequence: string;
}

export const findMotifs = (sequence: string, motif: string): MotifMatch[] => {
  const matches: MotifMatch[] = [];
  const upperSeq = sequence.toUpperCase();
  const upperMotif = motif.toUpperCase();

  for (let i = 0; i <= upperSeq.length - upperMotif.length; i++) {
    if (upperSeq.substring(i, i + upperMotif.length) === upperMotif) {
      matches.push({
        position: i + 1,
        sequence: sequence.substring(i, i + upperMotif.length)
      });
    }
  }

  return matches;
};

// New feature: Reading Frames
export const getReadingFrames = (sequence: string) => {
  const frames = [];

  // Forward frames (1, 2, 3)
  for (let start = 0; start < 3; start++) {
    const frame = [];
    for (let i = start; i < sequence.length; i += 3) {
      const codon = sequence.substring(i, i + 3);
      if (codon.length === 3) {
        const aminoAcid = CODON_TABLE[codon] || 'X';
        frame.push({ codon, aminoAcid });
      }
    }
    frames.push(frame);
  }

  // Reverse frames (-1, -2, -3)
  const revComp = reverseComplement(sequence);
  for (let start = 0; start < 3; start++) {
    const frame = [];
    for (let i = start; i < revComp.length; i += 3) {
      const codon = revComp.substring(i, i + 3);
      if (codon.length === 3) {
        const aminoAcid = CODON_TABLE[codon] || 'X';
        frame.push({ codon, aminoAcid });
      }
    }
    frames.push(frame);
  }

  return frames;
};

// New feature: Restriction Enzyme Sites
export interface RestrictionEnzyme {
  name: string;
  site: string;
  cutPosition: number; // Position relative to the start of the recognition site
}

export const COMMON_RESTRICTION_ENZYMES: RestrictionEnzyme[] = [
  { name: 'EcoRI', site: 'GAATTC', cutPosition: 1 },
  { name: 'BamHI', site: 'GGATCC', cutPosition: 1 },
  { name: 'HindIII', site: 'AAGCTT', cutPosition: 1 },
  { name: 'NotI', site: 'GCGGCCGC', cutPosition: 2 },
  { name: 'XhoI', site: 'CTCGAG', cutPosition: 1 },
  { name: 'SalI', site: 'GTCGAC', cutPosition: 1 },
  { name: 'PstI', site: 'CTGCAG', cutPosition: 5 },
  { name: 'SmaI', site: 'CCCGGG', cutPosition: 3 },
  { name: 'KpnI', site: 'GGTACC', cutPosition: 5 },
  { name: 'SacI', site: 'GAGCTC', cutPosition: 5 }
];

export interface RestrictionSite {
  enzyme: RestrictionEnzyme;
  position: number;
}

export const findRestrictionSites = (sequence: string, enzymes: RestrictionEnzyme[] = COMMON_RESTRICTION_ENZYMES): RestrictionSite[] => {
  const sites: RestrictionSite[] = [];
  const upperSeq = sequence.toUpperCase();

  enzymes.forEach(enzyme => {
    const site = enzyme.site.toUpperCase();
    for (let i = 0; i <= upperSeq.length - site.length; i++) {
      if (upperSeq.substring(i, i + site.length) === site) {
        sites.push({
          enzyme,
          position: i + 1
        });
      }
    }
  });

  return sites;
};

// New feature: GC Content Analysis
export const calculateGlobalGCContent = (sequence: string): number => {
  const { G, C } = countBases(sequence);
  const total = sequence.length;
  return total > 0 ? ((G + C) / total) * 100 : 0;
};

export const calculateGCContent = (sequence: string, windowSize: number = 100): number[] => {
  const result: number[] = [];
  const upperSeq = sequence.toUpperCase();

  for (let i = 0; i <= upperSeq.length - windowSize; i++) {
    const window = upperSeq.substring(i, i + windowSize);
    const gcCount = window.split('').filter(base => base === 'G' || base === 'C').length;
    result.push((gcCount / windowSize) * 100);
  }

  return result;
};

// New feature: CRISPR Guide RNA finder
export interface GuideRNA {
  sequence: string;
  position: number;
  pam: string;
  gcContent: number;
}

export const findGuideRNAs = (sequence: string, pamSequence: string = 'NGG'): GuideRNA[] => {
  const guides: GuideRNA[] = [];
  const upperSeq = sequence.toUpperCase();
  const guideLength = 20; // Standard CRISPR guide length

  for (let i = 0; i <= upperSeq.length - (guideLength + pamSequence.length - 1); i++) {
    const potentialPAM = upperSeq.substring(i + guideLength, i + guideLength + pamSequence.length);

    // Check if PAM matches the pattern
    let isMatch = true;
    for (let j = 0; j < pamSequence.length; j++) {
      if (pamSequence[j] !== 'N' && pamSequence[j] !== potentialPAM[j]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      const guideSeq = upperSeq.substring(i, i + guideLength);
      const gcCount = guideSeq.split('').filter(base => base === 'G' || base === 'C').length;
      guides.push({
        sequence: guideSeq,
        position: i + 1,
        pam: potentialPAM,
        gcContent: (gcCount / guideLength) * 100
      });
    }
  }

  return guides;
};

// New feature: Primer Design
export interface PrimerPair {
  forwardPrimer: string;
  reversePrimer: string;
  startPosition: number;
  endPosition: number;
  productSize: number;
  forwardTm: number;
  reverseTm: number;
}

export const calculateMeltingTemperature = (primer: string): number => {
  const upperPrimer = primer.toUpperCase();
  const { A, T, G, C } = countBases(upperPrimer);

  // Wallace rule (for short primers 14-20nt): Tm = 2*(A+T) + 4*(G+C)
  if (upperPrimer.length < 14) {
    return (2 * (A + T)) + (4 * (G + C));
  }

  // Basic Tm formula for longer sequences
  return 64.9 + 41 * (G + C - 16.4) / upperPrimer.length;
};

export const generatePrimers = (sequence: string, targetLength: number = 20, productSizeMin: number = 100, productSizeMax: number = 1000): PrimerPair[] => {
  const results: PrimerPair[] = [];
  const upperSeq = sequence.toUpperCase();

  for (let start = 0; start <= upperSeq.length - productSizeMin; start++) {
    for (let end = start + productSizeMin - 1; end < Math.min(start + productSizeMax, upperSeq.length); end++) {
      // Get potential primer regions
      const forwardRegion = upperSeq.substring(start, start + targetLength);
      const reverseRegionTemp = upperSeq.substring(end - targetLength + 1, end + 1);
      const reversePrimer = reverseComplement(reverseRegionTemp);

      // Calculate melting temps
      const forwardTm = calculateMeltingTemperature(forwardRegion);
      const reverseTm = calculateMeltingTemperature(reversePrimer);

      // Check for reasonable primer design
      const tmDiff = Math.abs(forwardTm - reverseTm);
      if (tmDiff <= 5 && forwardTm >= 50 && forwardTm <= 65 && reverseTm >= 50 && reverseTm <= 65) {
        results.push({
          forwardPrimer: forwardRegion,
          reversePrimer: reversePrimer,
          startPosition: start + 1,
          endPosition: end + 1,
          productSize: end - start + 1,
          forwardTm: forwardTm,
          reverseTm: reverseTm
        });

        // Limit results to a reasonable number
        if (results.length >= 10) break;
      }
    }
    if (results.length >= 10) break;
  }

  return results;
};
