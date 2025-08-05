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
    }

    export interface ActiveLyricsEnhancedLineData {
        type: LineType.ENHANCED_LYRIC;
        line: EnhancedLyricLine;
        words: ({ active: boolean; } & EnhancedWord)[];
    }

    export function getActiveLyrics(lyrics: (ParsedLine|ParsedEnhancedLine)[], duration: number): ActiveLyricsData {
        const lines: (ActiveLyricsLineData|ActiveLyricsEnhancedLineData)[] = [];

        lyricsLoop: for (const lyric of lyrics) {
            let isActive: boolean = false;

            switch (lyric.type) {
                case LineType.LYRIC:
                case LineType.ENHANCED_LYRIC:
                    isActive = lyric.startMillisecond <= duration;
                    break;
                case LineType.INVALID:
                case LineType.METADATA:
                    continue lyricsLoop;
            }

            // TODO: Shi
        }

        return {
            lines,
            startMs: 0,
            endMs: duration
        }
    }
}