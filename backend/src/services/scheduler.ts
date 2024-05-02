import cron from 'node-cron';
import { updateRankings } from './UserService';


// Uruchom aktualizację rankingu codziennie o północy
export const startCronJobs = () => {
    cron.schedule('42 21 * * *', () => {
        console.log('Running daily ranking update');
        updateRankings();
    });
}