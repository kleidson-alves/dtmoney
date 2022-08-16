import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

interface ITransaction {
    id: number;
    title: string;
    amount: number;
    category: string;
    createdAt: string;
    type: 'withdraw' | 'deposit';
}

type TransactionInput = Omit<ITransaction, 'id' | 'createdAt'>

interface TransactionsProviderProps {
    children: ReactNode;
}

interface TransactionsContextData  {
    transactions : ITransaction[];
    createTransaction: (transaction: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData);

export function TransactionsProvider({children} : TransactionsProviderProps){
    const [transactions, setTransactions] = useState<ITransaction[]>([]);

    useEffect(() => {
        api.get('transactions')
            .then(response => setTransactions(response.data.transactions));
    }, []);

    async function createTransaction(transaction : TransactionInput) {
       
        const response = await api.post('/transactions', {
            ...transaction,
            createdAt: new Date()
        });

        setTransactions([
            ...transactions, 
            response.data.transaction
        ]);

    }

    return <TransactionsContext.Provider value={{transactions, createTransaction}}>
        {children}
    </TransactionsContext.Provider>
}

export function useTransactions() {
    const context = useContext(TransactionsContext);

    return context;
}