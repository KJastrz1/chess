import cron from 'node-cron';
import { updateRankings } from './UserService';

export const startCronJobs = () => {
    cron.schedule('00 00 * * *', () => {
        console.log('Running daily ranking update');
        updateRankings();
    });
}