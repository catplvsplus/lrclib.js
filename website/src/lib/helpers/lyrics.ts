import { PersistedState } from 'runed';
import { publishSchema } from '../schemas/publish';
import { LyricsPublisher } from '../classes/LyricsPublisher.svelte';
import type { Lyric } from '@braccato/parsers';

export const publishDraft = new PersistedState('publish-draft', publishSchema.safeParse({}).data);
export const publisher = new LyricsPublisher();

interface LyricWordBase {
  startTime: number;
  endTime: number;
  word: string;
}
interface LyricWord extends LyricWordBase {
  romanWord?: string;
  obscene?: boolean;
  ruby?: LyricWordBase[];
}

interface LyricLine {
  words: LyricWord[];
  translatedLyric: string;
  romanLyric: string;
  startTime: number;
  endTime: number;
  isBG: boolean;
  isDuet: boolean;
}


export function braccatoLyricsToAppleMusicLyrics(lyrics: Lyric[]): LyricLine[] {
    return lyrics
        .filter(line => line.parts?.length || line.words.length)
        .map(line => {
            const base: Pick<LyricLine, 'isBG' | 'isDuet' | 'startTime' | 'endTime'> = {
                isBG: false,
                isDuet: !!line.agent && line.agent != 'v1',
                startTime: line.startTimeMs,
                endTime: line.durationMs + line.startTimeMs,
            };

            const main = line.parts?.filter(p => p.isBackground === false) ?? [];
            const bg = line.parts?.filter(p => p.isBackground === true) ?? [];

            if (!main.length && !bg.length) {
                return {
                    ...base,
                    translatedLyric: line.translation?.text ?? '',
                    romanLyric: line.romanization ?? '',
                    words: [
                        {
                            word: line.words,
                            startTime: line.startTimeMs,
                            endTime: line.durationMs + line.startTimeMs,
                            romanWord: line.romanization ?? '',
                        }
                    ],
                };
            }

            const lines: LyricLine[] = [
                {
                    ...base,
                    isBG: false,
                    translatedLyric: line.translation?.text ?? '',
                    romanLyric: line.romanization ?? '',
                    words: main.map(w => ({
                        word: w.words,
                        startTime: w.startTimeMs,
                        endTime: w.durationMs + w.startTimeMs,
                        romanWord: line.timedRomanization?.find(r => r.startTimeMs === w.startTimeMs && r.durationMs === w.durationMs && r.words !== w.words)?.words ?? '',
                    })),
                }
            ];

            if (bg.length) {
                lines.push({
                    ...base,
                    isBG: true,
                    translatedLyric: '',
                    romanLyric: '',
                    words: bg.map(w => ({
                        word: w.words,
                        startTime: w.startTimeMs,
                        endTime: w.durationMs + w.startTimeMs,
                        romanWord: line.timedRomanization?.find(r => r.startTimeMs === w.startTimeMs && r.durationMs === w.durationMs)?.words ?? '',
                    })),
                });
            }

            return lines;
        }).flat();
}