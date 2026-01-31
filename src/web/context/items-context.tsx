import { createContext, useContext, useState, ReactNode } from "react";

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
  addItem: (item: Omit<Item, "id" | "createdAt">) => void;
  updateItem: (id: string, item: Partial<Omit<Item, "id" | "createdAt">>) => void;
  deleteItem: (id: string) => void;
}

const ItemsContext = createContext<ItemsContextType | null>(null);

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Sample initial data for better UX
const initialItems: Item[] = [
  {
    id: generateId(),
    name: "Wireless Keyboard",
    description: "Mechanical keyboard with RGB backlighting",
    price: 129.99,
    quantity: 45,
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: generateId(),
    name: "USB-C Hub",
    description: "7-in-1 adapter with HDMI and SD card slots",
    price: 49.99,
    quantity: 120,
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: generateId(),
    name: "Monitor Stand",
    description: "Adjustable aluminum stand with cable management",
    price: 89.99,
    quantity: 30,
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: generateId(),
    name: "Webcam HD",
    description: "1080p webcam with built-in microphone",
    price: 79.99,
    quantity: 65,
    createdAt: new Date(Date.now() - 86400000),
  },
];

export const ItemsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Item[]>(initialItems);

  const addItem = (newItem: Omit<Item, "id" | "createdAt">) => {
    const item: Item = {
      ...newItem,
      id: generateId(),
      createdAt: new Date(),
    };
    setItems(prev => [item, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<Omit<Item, "id" | "createdAt">>) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <ItemsContext.Provider value={{ items, addItem, updateItem, deleteItem }}>
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
