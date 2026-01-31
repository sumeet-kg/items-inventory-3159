import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  createdAt: Date;
}

interface ItemsContextType {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  addItem: (item: Omit<Item, "id" | "createdAt">) => Promise<void>;
  updateItem: (id: string, item: Partial<Omit<Item, "id" | "createdAt">>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  refreshItems: () => Promise<void>;
}

const ItemsContext = createContext<ItemsContextType | null>(null);

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/items', {
        credentials: 'include',
      });
      
      if (response.status === 401) {
        // User not authenticated, return empty array
        setItems([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      
      const data = await response.json();
      // Convert date strings to Date objects
      const itemsWithDates = data.map((item: Item & { createdAt: string | Date }) => ({
        ...item,
        createdAt: new Date(item.createdAt),
      }));
      setItems(itemsWithDates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem = async (newItem: Omit<Item, "id" | "createdAt">) => {
    setError(null);
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newItem),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add item');
      }
      
      const createdItem = await response.json();
      setItems(prev => [{
        ...createdItem,
        createdAt: new Date(createdItem.createdAt),
      }, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateItem = async (id: string, updates: Partial<Omit<Item, "id" | "createdAt">>) => {
    setError(null);
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update item');
      }
      
      const updatedItem = await response.json();
      setItems(prev =>
        prev.map(item =>
          item.id === id ? {
            ...updatedItem,
            createdAt: new Date(updatedItem.createdAt),
          } : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    setError(null);
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete item');
      }
      
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return (
    <ItemsContext.Provider value={{ items, isLoading, error, addItem, updateItem, deleteItem, refreshItems }}>
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }
  return context;
};
