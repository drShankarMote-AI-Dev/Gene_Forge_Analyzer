export const MAX_SEQUENCE_LENGTH = 100000;

export interface FastaRecord {
  header: string;
  sequence: string;
  length: number;
}

export const parseFasta = (input: string): FastaRecord[] => {
  const records: FastaRecord[] = [];
  const lines = input.split('\n');
  let currentHeader = '';
  let currentSeq = '';

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('>')) {
      if (currentHeader || currentSeq) {
        records.push({
          header: currentHeader || 'Sequence',
          sequence: currentSeq.replace(/\s/g, '').toUpperCase(),
          length: currentSeq.replace(/\s/g, '').length
        });
      }
      currentHeader = trimmed.substring(1);
      currentSeq = '';
    } else {
      currentSeq += trimmed;
    }
  });

  if (currentHeader || currentSeq) {
    const clean = currentSeq.replace(/\s/g, '').toUpperCase();
    records.push({
      header: currentHeader || 'Sequence',
      sequence: clean,
      length: clean.length
    });
  }

  return records;
};


export const cleanSequence = (input: string): string => {
  if (!input) return "";
  // Normalize: uppercase and remove FASTA headers (lines starting with >)
  const lines = input.split('\n');
  const sequenceLines = lines.filter(line => !line.trim().startsWith('>'));
  // Joins lines and remove all whitespace/newlines/tabs
  return sequenceLines.join('').replace(/[^a-zA-Z]/g, '').toUpperCase().trim();
};

export const validateDNA = (input: string): { valid: boolean; error?: string; cleaned?: string } => {
  const cleaned = cleanSequence(input);

  if (cleaned.length === 0) {
    return { valid: false, error: "Empty sequence or invalid genomic descriptors detected." };
  }

  if (cleaned.length > MAX_SEQUENCE_LENGTH) {
    return { valid: false, error: `Genomic string exceeds maximum operational buffer (${MAX_SEQUENCE_LENGTH.toLocaleString()} BP).` };
  }

  // Strictly allowed characters: A, T, G, C, N
  const invalidChars = cleaned.replace(/[ATGCN]/g, '');
  if (invalidChars.length > 0) {
    const uniqueInvalids = Array.from(new Set(invalidChars)).join(', ');
    return {
      valid: false,
      error: `Structural Discontinuity: Invalid nucleotides detected [${uniqueInvalids}]. Only A, T, G, C, and N (ambiguity) are supported in this engine.`
    };
  }

  return { valid: true, cleaned };
};

/**
 * Higher-order utility to handle multi-sequence or complex biological inputs
 */
export const parseBiologicalInput = (input: string): string[] => {
  if (!input) return [];
  // Detect if it's FASTA
  if (input.trim().startsWith('>')) {
    return parseFasta(input).map(r => r.sequence);
  }
  // Otherwise, split by potential delimiters if they exist, or treat as single
  // For most tools, we just want the cleaned single sequence
  return [cleanSequence(input)];
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

export interface AminoAcidResult {
  codon: string;
  aminoAcid: string;
}

export const getAminoAcids = (sequence: string): AminoAcidResult[] => {
  const result: AminoAcidResult[] = [];
  // Keep only valid DNA bases for translation to ensure correct reading frames
  const cleanSeq = sequence.toUpperCase().replace(/[^ATGC]/g, '');

  for (let i = 0; i <= cleanSeq.length - 3; i += 3) {
    const codon = cleanSeq.substring(i, i + 3);
    const aminoAcid = CODON_TABLE[codon] || 'Unknown';
    result.push({ codon, aminoAcid });
  }

  return result;
};

export const translateDNA = (sequence: string): string => {
  let protein = '';
  for (let i = 0; i <= sequence.length - 3; i += 3) {
    const codon = sequence.substring(i, i + 3).toUpperCase();
    protein += CODON_TABLE[codon] ? (CODON_TABLE[codon] === 'Stop' ? '*' : CODON_TABLE[codon].charAt(0)) : 'X';
  }
  return protein;
};

export const transcribeDNA = (sequence: string): string => {
  return sequence.toUpperCase().replace(/T/g, 'U');
};

export const calculateATContent = (sequence: string): number => {
  const { A, T } = countBases(sequence);
  return sequence.length > 0 ? ((A + T) / sequence.length) * 100 : 0;
};

export const getAminoAcidComposition = (proteinSequence: string) => {
  const composition: Record<string, number> = {};
  proteinSequence.split('').forEach(aa => {
    composition[aa] = (composition[aa] || 0) + 1;
  });
  return composition;
};

const AMINO_ACID_WEIGHTS: Record<string, number> = {
  'A': 89.09, 'R': 174.20, 'N': 132.12, 'D': 133.10, 'C': 121.16,
  'E': 147.13, 'Q': 146.15, 'G': 75.07, 'H': 155.16, 'I': 131.18,
  'L': 131.18, 'K': 146.19, 'M': 149.21, 'F': 165.19, 'P': 115.13,
  'S': 105.09, 'T': 119.12, 'W': 204.23, 'Y': 181.19, 'V': 117.15,
  '*': 0
};

export const calculateProteinMolecularWeight = (proteinSequence: string): number => {
  return proteinSequence.split('').reduce((acc, aa) => acc + (AMINO_ACID_WEIGHTS[aa] || 0), 0);
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

// Needleman-Wunsch Global Alignment
export const globalAlignment = (seq1: string, seq2: string, match = 1, mismatch = -1, gap = -1) => {
  const m = seq1.length;
  const n = seq2.length;
  const score = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) score[i][0] = i * gap;
  for (let j = 0; j <= n; j++) score[0][j] = j * gap;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const s = seq1[i - 1] === seq2[j - 1] ? match : mismatch;
      score[i][j] = Math.max(
        score[i - 1][j - 1] + s,
        score[i - 1][j] + gap,
        score[i][j - 1] + gap
      );
    }
  }

  // Traceback
  let align1 = "";
  let align2 = "";
  let i = m, j = n;
  while (i > 0 && j > 0) {
    const s = seq1[i - 1] === seq2[j - 1] ? match : mismatch;
    if (score[i][j] === score[i - 1][j - 1] + s) {
      align1 = seq1[i - 1] + align1;
      align2 = seq2[j - 1] + align2;
      i--; j--;
    } else if (score[i][j] === score[i - 1][j] + gap) {
      align1 = seq1[i - 1] + align1;
      align2 = "-" + align2;
      i--;
    } else {
      align1 = "-" + align1;
      align2 = seq2[j - 1] + align2;
      j--;
    }
  }
  while (i > 0) { align1 = seq1[i - 1] + align1; align2 = "-" + align2; i--; }
  while (j > 0) { align1 = "-" + align1; align2 = seq2[j - 1] + align2; j--; }

  return { align1, align2, score: score[m][n] };
};

// Smith-Waterman Local Alignment
export const localAlignment = (seq1: string, seq2: string, match = 1, mismatch = -1, gap = -1) => {
  const m = seq1.length;
  const n = seq2.length;
  const score = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  let maxScore = 0;
  let maxI = 0, maxJ = 0;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const s = seq1[i - 1] === seq2[j - 1] ? match : mismatch;
      score[i][j] = Math.max(
        0,
        score[i - 1][j - 1] + s,
        score[i - 1][j] + gap,
        score[i][j - 1] + gap
      );
      if (score[i][j] > maxScore) {
        maxScore = score[i][j];
        maxI = i; maxJ = j;
      }
    }
  }

  // Traceback
  let align1 = "";
  let align2 = "";
  let i = maxI, j = maxJ;
  while (i > 0 && j > 0 && score[i][j] > 0) {
    const s = seq1[i - 1] === seq2[j - 1] ? match : mismatch;
    if (score[i][j] === score[i - 1][j - 1] + s) {
      align1 = seq1[i - 1] + align1;
      align2 = seq2[j - 1] + align2;
      i--; j--;
    } else if (score[i][j] === score[i - 1][j] + gap) {
      align1 = seq1[i - 1] + align1;
      align2 = "-" + align2;
      i--;
    } else {
      align1 = "-" + align1;
      align2 = seq2[j - 1] + align2;
      j--;
    }
  }

  return { align1, align2, score: maxScore };
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

export const calculateGCContentWindow = (sequence: string, windowSize: number = 20): { position: number, gc: number }[] => {
  const result: { position: number, gc: number }[] = [];
  const upperSeq = sequence.toUpperCase();

  // If sequence is small, use actual length as window
  const actualWindow = Math.min(windowSize, upperSeq.length);
  const step = Math.max(1, Math.floor(upperSeq.length / 50)); // Sample ~50 points for the chart

  for (let i = 0; i <= upperSeq.length - actualWindow; i += step) {
    const window = upperSeq.substring(i, i + actualWindow);
    const gcCount = window.split('').filter(base => base === 'G' || base === 'C').length;
    result.push({
      position: i + 1,
      gc: Number(((gcCount / actualWindow) * 100).toFixed(1))
    });
  }

  return result;
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

export const calculateComplexity = (sequence: string): number => {
  const bases = countBases(sequence);
  const total = sequence.length;
  if (total === 0) return 0;

  // Shannon Entropy-like measure
  let entropy = 0;
  ['A', 'T', 'G', 'C'].forEach(b => {
    const p = bases[b as keyof typeof bases] / total;
    if (p > 0) entropy -= p * Math.log2(p);
  });

  // Normalize (max entropy for 4 bases is 2.0)
  return (entropy / 2.0) * 100;
};

export const calculateStabilityScore = (sequence: string): number => {
  const gc = calculateGlobalGCContent(sequence);
  const complexity = calculateComplexity(sequence);

  // Biological stability heuristic: 
  // Optimal GC is 40-60%. Complexity should be high.
  const gcFactor = 100 - Math.abs(50 - gc) * 2;
  return (gcFactor * 0.6 + complexity * 0.4);
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

// New feature: Codon Usage Analyzer
export interface CodonUsage {
  codon: string;
  aminoAcid: string;
  count: number;
  frequency: number;
}

export const calculateCodonUsage = (sequence: string): CodonUsage[] => {
  const usage: Record<string, number> = {};
  let totalCodons = 0;

  for (let i = 0; i <= sequence.length - 3; i += 3) {
    const codon = sequence.substring(i, i + 3).toUpperCase();
    if (codon.length === 3) {
      usage[codon] = (usage[codon] || 0) + 1;
      totalCodons++;
    }
  }

  return Object.entries(usage).map(([codon, count]) => ({
    codon,
    aminoAcid: CODON_TABLE[codon] || 'Unknown',
    count,
    frequency: totalCodons > 0 ? (count / totalCodons) : 0
  })).sort((a, b) => b.count - a.count);
};

// New feature: Palindrome Finder (Inverted Repeats)
export interface PalindromeMatch {
  position: number;
  sequence: string;
  length: number;
}

export const findPalindromes = (sequence: string, minLength: number = 4, maxLength: number = 20): PalindromeMatch[] => {
  const matches: PalindromeMatch[] = [];
  const upperSeq = sequence.toUpperCase();

  for (let len = minLength; len <= maxLength; len++) {
    for (let i = 0; i <= upperSeq.length - len; i++) {
      const sub = upperSeq.substring(i, i + len);
      const revComp = reverseComplement(sub);
      if (sub === revComp) {
        matches.push({
          position: i + 1,
          sequence: sub,
          length: len
        });
      }
    }
  }

  return matches.sort((a, b) => a.position - b.position);
};

export const findTandemRepeats = (sequence: string, minUnitSize = 2, maxUnitSize = 6) => {
  const repeats: { unit: string, position: number, count: number }[] = [];
  const upperSeq = sequence.toUpperCase();

  for (let unitSize = minUnitSize; unitSize <= maxUnitSize; unitSize++) {
    for (let i = 0; i <= upperSeq.length - unitSize * 2; i++) {
      const unit = upperSeq.substring(i, i + unitSize);
      let count = 1;
      while (upperSeq.substring(i + count * unitSize, i + (count + 1) * unitSize) === unit) {
        count++;
      }
      if (count >= 2) {
        repeats.push({ unit, position: i + 1, count });
        i += (count * unitSize) - 1; // Skip ahead
      }
    }
  }
  return repeats;
};

export const simulatePCRExtension = (sequence: string, forwardPrimer: string, reversePrimer: string) => {
  const upperSeq = sequence.toUpperCase();
  const fwd = forwardPrimer.toUpperCase();
  const rev = reverseComplement(reversePrimer).toUpperCase(); // rev primer is comp to strand

  const fwdPos = upperSeq.indexOf(fwd);
  const revPos = upperSeq.lastIndexOf(rev);

  if (fwdPos !== -1 && revPos !== -1 && revPos > fwdPos) {
    return {
      success: true,
      product: upperSeq.substring(fwdPos, revPos + rev.length),
      length: (revPos + rev.length) - fwdPos
    };
  }
  return { success: false, error: "Primers do not form a distinct product." };
};

export const digestSequence = (sequence: string, enzymes: RestrictionEnzyme[]) => {
  const sites = findRestrictionSites(sequence, enzymes);
  const sortedPositions = [0, ...sites.map(s => s.position), sequence.length];
  const fragments = [];

  for (let i = 0; i < sortedPositions.length - 1; i++) {
    fragments.push({
      start: sortedPositions[i],
      end: sortedPositions[i + 1],
      length: sortedPositions[i + 1] - sortedPositions[i],
      sequence: sequence.substring(sortedPositions[i], sortedPositions[i + 1])
    });
  }
  return { sites, fragments };
};
