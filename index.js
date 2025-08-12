// @ts-check
import lrclib, { ChallengeSolver } from "lrclib.js";
import humanizeDuration from "humanize-duration";
import ora from 'ora';
import chalk from 'chalk';

export const formatDurationString = humanizeDuration.humanizer({
    largest: 1,
    language: "shortEn",
    maxDecimalPoints: 1,
    spacer: "",
    languages: {
        shortEn: {
            y: () => "y",
            mo: () => "mo",
            w: () => "w",
            d: () => "d",
            h: () => "h",
            m: () => "m",
            s: () => "s",
            ms: () => "ms",
        },
    },
});

const spinner = ora(chalk.green('Starting challenge solver...')).start();

spinner.text = chalk.green('Requesting challenge...');
const challenge = await lrclib.requestChallenge();

spinner.text = chalk.green('Challenge received. Initializing solver...');
const solver = new ChallengeSolver(challenge, {
    method: 'web',
    onAttempt: s => spinner.text = chalk.yellow(formatDurationString(Date.now() - (s.solveStartTime ?? 0))) + ` ${chalk.cyan(solver.token)}`,
});

spinner.text = chalk.green('Solving challenge...');
await solver.solve();

spinner.succeed(chalk.green('Challenge solved!'));
console.log(chalk.green(`Token: ${solver.token}`));