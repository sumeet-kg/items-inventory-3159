import DashboardLayout from "@/components/dashboard-layout";
import { useItems } from "@/context/items-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string;
  delay?: number;
}

const StatCard = ({ title, value, subtitle, icon, accentColor = "primary", delay = 0 }: StatCardProps) => (
  <Card 
    className="animate-slide-up opacity-0 relative overflow-hidden group hover:border-primary/30 transition-colors"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: `radial-gradient(circle at top right, oklch(0.75 0.18 175 / 0.05) 0%, transparent 50%)`
      }}
    />
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className={`text-${accentColor} opacity-70`}>
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </CardContent>
  </Card>
);

const AnalyticsPage = () => {
  const { items } = useItems();

  // Calculate analytics
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const averagePrice = totalItems > 0 
    ? items.reduce((sum, item) => sum + item.price, 0) / totalItems 
    : 0;
  
  const sortedByPrice = [...items].sort((a, b) => b.price - a.price);
  const highestPricedItem = sortedByPrice[0];
  const lowestPricedItem = sortedByPrice[sortedByPrice.length - 1];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your inventory performance
          </p>
        </div>

        {/* Primary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Items"
            value={totalItems}
            subtitle="Unique products"
            delay={0}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          <StatCard
            title="Total Value"
            value={formatCurrency(totalValue)}
            subtitle="Combined inventory worth"
            delay={100}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Total Quantity"
            value={totalQuantity.toLocaleString()}
            subtitle="Units in stock"
            delay={200}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
          />
          <StatCard
            title="Average Price"
            value={formatCurrency(averagePrice)}
            subtitle="Per item"
            delay={300}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        {/* Price Range Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="animate-slide-up opacity-0 delay-400 group hover:border-green-500/30 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Highest Priced Item
              </CardTitle>
            </CardHeader>
            <CardContent>
              {highestPricedItem ? (
                <div className="space-y-1">
                  <div className="text-lg font-semibold">{highestPricedItem.name}</div>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(highestPricedItem.price)}</div>
                  <p className="text-sm text-muted-foreground">
                    {highestPricedItem.quantity} units · {formatCurrency(highestPricedItem.price * highestPricedItem.quantity)} total
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">No items available</p>
              )}
            </CardContent>
          </Card>

          <Card className="animate-slide-up opacity-0 delay-500 group hover:border-blue-500/30 transition-colors">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Lowest Priced Item
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowestPricedItem ? (
                <div className="space-y-1">
                  <div className="text-lg font-semibold">{lowestPricedItem.name}</div>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(lowestPricedItem.price)}</div>
                  <p className="text-sm text-muted-foreground">
                    {lowestPricedItem.quantity} units · {formatCurrency(lowestPricedItem.price * lowestPricedItem.quantity)} total
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">No items available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Visual Chart - Item Distribution */}
        {items.length > 0 && (
          <Card className="animate-slide-up opacity-0" style={{ animationDelay: '600ms' }}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inventory Value Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedByPrice.slice(0, 5).map((item, index) => {
                  const itemValue = item.price * item.quantity;
                  const percentage = totalValue > 0 ? (itemValue / totalValue) * 100 : 0;
                  
                  return (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium truncate max-w-[200px]">{item.name}</span>
                        <span className="text-muted-foreground font-mono">
                          {formatCurrency(itemValue)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${percentage}%`,
                            background: `oklch(0.75 0.18 ${175 + index * 30})`,
                            animationDelay: `${700 + index * 100}ms`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {items.length > 5 && (
                <p className="text-xs text-muted-foreground mt-4">
                  Showing top 5 items by price
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <Card className="animate-slide-up opacity-0 delay-400">
            <CardContent className="py-12 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">No data to display</h3>
              <p className="text-sm text-muted-foreground">
                Add items to your inventory to see analytics here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
