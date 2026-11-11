import { Context } from 'runed';
import type { Player } from '../classes/Player.svelte';

export const playerContext = new Context<Player>('audio-player');