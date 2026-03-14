const API_BASE = 'https://api.coingecko.com/api/v3';

const cachedQuery = {}; 
const CACHE_DURATION = 30000; 

export const fetchMarketData = async (count) => {
    const cacheKey = `market_data_${count}`;
    const now = Date.now();

    if (cachedQuery[cacheKey] && (now - cachedQuery[cacheKey].timestamp < CACHE_DURATION)) {
        return Promise.resolve(cachedQuery[cacheKey].data);
    }

    try {
        const response = await fetch(`${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=false`);
        
        if (!response.ok) throw new Error('Error en la API');
        
        const json = await response.json();

        cachedQuery[cacheKey] = {
            timestamp: now,
            data: json
        };

        const localData = localStorage.getItem(cacheKey);
        const jsonString = JSON.stringify(json);
        
        if (!localData || jsonString !== localData) {
            localStorage.setItem(cacheKey, jsonString);
        }

        return json;

    } catch (error) {
        console.warn("Fetch failed, intentando rescate:", error);
        
        const localData = localStorage.getItem(cacheKey);
        if (localData) {
            const parsed = JSON.parse(localData);
            cachedQuery[cacheKey] = { timestamp: now, data: parsed }; 
            return parsed;
        }

        return [
            { id: '1', name: 'Bitcoin', symbol: 'btc', current_price: 70000, price_change_percentage_24h: 3.2, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
            { id: '2', name: 'Ethereum', symbol: 'eth', current_price: 3800, price_change_percentage_24h: -1.5, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
            { id: '3', name: 'Solana', symbol: 'sol', current_price: 145, price_change_percentage_24h: 1.8, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
            { id: '4', name: 'Tether', symbol: 'usdt', current_price: 1, price_change_percentage_24h: 0.01, image: 'https://assets.coingecko.com/coins/images/325/large/tether.png' },
            { id: '5', name: 'BNB', symbol: 'bnb', current_price: 656, price_change_percentage_24h: -0.72, image: 'https://assets.coingecko.com/coins/images/825/large/bnb.png' },
            { id: '6', name: 'XRP', symbol: 'xrp', current_price: 1.4, price_change_percentage_24h: -0.68, image: 'https://assets.coingecko.com/coins/images/44/large/xrp.png' }
        ].slice(0, count);
    }
};