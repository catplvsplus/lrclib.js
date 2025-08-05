import { parse as parseLRC, parseEnhanced as parseEnhancedLRC } from 'clrc';

/**
 * @author mebtte <hi@mebtte.com>
 */
export namespace LRC {
    export enum LineType {
        INVALID = "invalid",
        METADATA = "metadata",
        LYRIC = "lyric",
        ENHANCED_LYRIC = "enhanced_lyric"
    }

    export interface Line {
        lineNumber: number;
        raw: string;
        type: LineType;
    }

    export interface MetadataLine<MetadataKey extends string> extends Line {
        type: LineType.METADATA;
        key: MetadataKey;
        value: string;
    }

    export interface LyricLine extends Line {
        type: LineType.LYRIC;
        startMillisecond: number;
        content: string;
    }

    export interface InvalidLine extends Line {
        type: LineType.INVALID;
    }

    export interface EnhancedWord {
        index: number;
        raw: string;
        startMillisecond: number;
        content: string;
    }

    export interface EnhancedLyricLine extends Omit<LyricLine, 'type'> {
        type: LineType.ENHANCED_LYRIC;
        words: EnhancedWord[];
    }

    export type ParsedLine<MK extends string = string> = InvalidLine|MetadataLine<MK>|LyricLine;
    export type ParsedEnhancedLine<MK extends string = string> = InvalidLine|MetadataLine<MK>|EnhancedLyricLine;

    export const parse: <MK extends string>(lyrics: string) => ParsedLine<MK>[] = parseLRC;
    export const parseEnhanced: <MK extends string>(lyrics: string) => ParsedEnhancedLine<MK>[] = parseEnhancedLRC;

    export function toPlain(lyrics: (ParsedLine|ParsedEnhancedLine)[]): string {
        return lyrics.map(line => {
            switch (line.type) {
                case LineType.LYRIC:
                    return line.content.trim();
                case LineType.ENHANCED_LYRIC:
                    return line.words.map(w => w.content.trim()).join(' ');
                case LineType.INVALID:
                case LineType.METADATA:
                    return null;
            }
        }).join('\n');
    }

    export function isValidLRC(lyrics: string): boolean {
        const parse = LRC.parse(lyrics);
        return parse.every(line => line.type !== LineType.INVALID);
    }

    export interface ActiveLyricsData {
        lines: (ActiveLyricsLineData|ActiveLyricsEnhancedLineData)[];
        startMs: number;
        endMs: number;
    }

    export interface ActiveLyricsLineData {
        type: LineType.LYRIC;
        line: LyricLine;
        startMs: number;
        endMs: number;
    }

    export interface ActiveLyricsEnhancedLineData {
        type: LineType.ENHANCED_LYRIC;
        line: EnhancedLyricLine;
        words: ({
            active: boolean;
            startMs: number;
            endMs: number;
        } & EnhancedWord)[];
        startMs: number;
        endMs: number;
    }

    export function getActiveLyrics(lyrics: (ParsedLine|ParsedEnhancedLine)[], durationMs: number): ActiveLyricsData {
        const lyricLines = lyrics.filter(line => line.type === LineType.LYRIC || line.type === LineType.ENHANCED_LYRIC);
        const lines: (ActiveLyricsLineData|ActiveLyricsEnhancedLineData)[] = [];

        for (const currentLine of lyricLines) {
            if (currentLine.startMillisecond > durationMs) continue;

            const currentIndex = lyricLines.findIndex(l => l.lineNumber === currentLine.lineNumber);
            const nextLine = currentIndex < (lyricLines.length - 1) ? lyricLines.at(currentIndex + 1) : undefined;

            const startMs = currentLine.startMillisecond;
            const endMs = nextLine?.startMillisecond ?? durationMs;
            if (durationMs >= endMs) continue;

            if (currentLine.type === LineType.LYRIC) {
                lines.push({ type: LineType.LYRIC, line: currentLine, startMs, endMs });
                continue;
            }

            const words: ActiveLyricsEnhancedLineData['words'] = currentLine.words.map(word => {
                const nextWord = currentLine?.words.find(w => w.index === word.index + 1);
                const wordStartMs = word.startMillisecond;
                const wordEndMs = nextWord?.startMillisecond ?? endMs;

                return {
                    ...word,
                    active: wordStartMs > durationMs && durationMs >= wordEndMs,
                    startMs: wordStartMs,
                    endMs: wordEndMs
                };
            });

            lines.push({ type: LineType.ENHANCED_LYRIC, line: currentLine, words, startMs, endMs });
        }

        return {
            lines,
            startMs: 0,
            endMs: durationMs
        }
    }
}