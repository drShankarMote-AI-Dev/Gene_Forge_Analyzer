import { describe, it, expect } from 'vitest';
import {
    validateDNA,
    countBases,
    reverseComplement,
    calculateGlobalGCContent,
    calculateMeltingTemperature,
    getReadingFrames,
    findSNPs,
    findGuideRNAs
} from './dnaUtils';

describe('Biological Calculations Engine (BIO_005)', () => {

    it('should validate DNA sequence correctly', () => {
        expect(validateDNA('ATGC').valid).toBe(true);
        expect(validateDNA('ATGCN').valid).toBe(false); // Only A,T,G,C
        expect(validateDNA('Z').valid).toBe(false);
    });

    it('should calculate global GC content accurately', () => {
        const sequence = 'GGCC';
        expect(calculateGlobalGCContent(sequence)).toBe(100);

        const sequence2 = 'AATT';
        expect(calculateGlobalGCContent(sequence2)).toBe(0);

        const sequence3 = 'GCAT';
        expect(calculateGlobalGCContent(sequence3)).toBe(50);
    });

    it('should perform reverse complement correctly', () => {
        expect(reverseComplement('ATGC')).toBe('GCAT');
        expect(reverseComplement('GAAA')).toBe('TTTC');
    });

    it('should calculate melting temperature using Wallace Rule for short sequences', () => {
        // ATGC (4 bases < 14) -> 2*(1+1) + 4*(1+1) = 4 + 8 = 12
        expect(calculateMeltingTemperature('ATGC')).toBe(12);
    });

    it('should detect SNPs correctly', () => {
        const ref = 'ATGC';
        const sample = 'ATTC';
        const snps = findSNPs(ref, sample);
        expect(snps.length).toBe(1);
        expect(snps[0].position).toBe(3);
        expect(snps[0].alternateBase).toBe('T');
    });

    it('should find CRISPR guide RNAs with NGG PAM', () => {
        // Sequence with PAM at the end: 20nt + PAM(NGG)
        // 12345678901234567890 21 22 23
        // ATGCATGCATGCATGCATGC T G G
        const seq = 'ATGCATGCATGCATGCATGCTGG';
        const guides = findGuideRNAs(seq);
        expect(guides.length).toBe(1);
        expect(guides[0].pam).toBe('TGG');
    });

    it('should generate all 6 reading frames', () => {
        const sequence = 'ATGCCC';
        const frames = getReadingFrames(sequence);
        // 3 forward, 3 reverse
        expect(frames.length).toBe(6);
    });

    it('should count bases correctly', () => {
        const sequence = 'AATTC';
        const counts = countBases(sequence);
        expect(counts.A).toBe(2);
        expect(counts.T).toBe(2);
        expect(counts.C).toBe(1);
        expect(counts.G).toBe(0);
    });
});
