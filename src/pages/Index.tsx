import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SLOT_SYMBOLS = ["🍒", "🍋", "🍊", "💎", "7️⃣", "⭐"];
const ROULETTE_NUMBERS = Array.from({ length: 37 }, (_, i) => i);

export default function Index() {
  const [balance, setBalance] = useState(5000);
  const [currentTab, setCurrentTab] = useState("slots");
  const { toast } = useToast();

  const [slots, setSlots] = useState(["🎰", "🎰", "🎰"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [slotBet, setSlotBet] = useState(100);

  const [rouletteNumber, setRouletteNumber] = useState<number | null>(null);
  const [isSpinningRoulette, setIsSpinningRoulette] = useState(false);
  const [rouletteBet, setRouletteBet] = useState(100);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"mir" | "youmoney">("mir");

  const spinSlots = () => {
    if (balance < slotBet) {
      toast({
        title: "Недостаточно средств",
        description: "Пополните баланс для продолжения игры",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    setBalance(balance - slotBet);

    const spinInterval = setInterval(() => {
      setSlots([
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      const finalSlots = [
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
      ];
      setSlots(finalSlots);
      setIsSpinning(false);

      if (finalSlots[0] === finalSlots[1] && finalSlots[1] === finalSlots[2]) {
        const winAmount = slotBet * 10;
        setBalance((prev) => prev + winAmount);
        toast({
          title: "🎉 ДЖЕКПОТ!",
          description: `Вы выиграли ${winAmount}₽!`,
        });
      } else if (finalSlots[0] === finalSlots[1] || finalSlots[1] === finalSlots[2]) {
        const winAmount = slotBet * 2;
        setBalance((prev) => prev + winAmount);
        toast({
          title: "Выигрыш!",
          description: `Вы выиграли ${winAmount}₽!`,
        });
      }
    }, 2000);
  };

  const spinRoulette = () => {
    if (selectedNumber === null) {
      toast({
        title: "Выберите число",
        description: "Сделайте ставку на число от 0 до 36",
        variant: "destructive",
      });
      return;
    }

    if (balance < rouletteBet) {
      toast({
        title: "Недостаточно средств",
        description: "Пополните баланс для продолжения игры",
        variant: "destructive",
      });
      return;
    }

    setIsSpinningRoulette(true);
    setBalance(balance - rouletteBet);
    setRouletteNumber(null);

    setTimeout(() => {
      const result = Math.floor(Math.random() * 37);
      setRouletteNumber(result);
      setIsSpinningRoulette(false);

      if (result === selectedNumber) {
        const winAmount = rouletteBet * 36;
        setBalance((prev) => prev + winAmount);
        toast({
          title: "🎉 ПОБЕДА!",
          description: `Выпало ${result}! Вы выиграли ${winAmount}₽!`,
        });
      } else {
        toast({
          title: "Не повезло",
          description: `Выпало ${result}. Попробуйте еще раз!`,
          variant: "destructive",
        });
      }
    }, 3000);
  };

  const handleDeposit = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму",
        variant: "destructive",
      });
      return;
    }

    setBalance((prev) => prev + amount);
    toast({
      title: "Успешно!",
      description: `Баланс пополнен на ${amount}₽`,
    });
    setShowPayment(false);
    setPaymentAmount("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0000] via-[#0a0a0a] to-[#1a0a00] text-primary">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-primary via-yellow-300 to-primary bg-clip-text text-transparent animate-fade-in">
            CASINO ROYALE
          </h1>
          <p className="text-muted-foreground text-lg">Элегантность. Азарт. Роскошь.</p>
        </div>

        <div className="flex justify-center items-center gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Icon name="Wallet" size={32} className="text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Баланс</p>
                  <p className="text-3xl font-bold text-primary">{balance.toLocaleString()}₽</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => setShowPayment(true)}
            className="bg-gradient-to-r from-primary to-yellow-600 hover:from-yellow-600 hover:to-primary text-background font-semibold px-8 py-6 text-lg"
          >
            <Icon name="Plus" className="mr-2" />
            Пополнить
          </Button>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-primary/30">
            <TabsTrigger value="slots" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-yellow-600 data-[state=active]:text-background">
              <Icon name="Cherry" className="mr-2" />
              Слоты
            </TabsTrigger>
            <TabsTrigger value="roulette" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-yellow-600 data-[state=active]:text-background">
              <Icon name="Circle" className="mr-2" />
              Рулетка
            </TabsTrigger>
          </TabsList>

          <TabsContent value="slots">
            <Card className="bg-gradient-to-br from-card via-card to-secondary/10 border-primary/50">
              <CardHeader>
                <CardTitle className="text-3xl text-center text-primary">🎰 Слот-машина</CardTitle>
                <CardDescription className="text-center">Три одинаковых символа — джекпот x10!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center items-center gap-4 p-8 bg-gradient-to-br from-background to-secondary/20 rounded-lg border-2 border-primary/50">
                  {slots.map((symbol, i) => (
                    <div
                      key={i}
                      className={`text-8xl bg-card border-4 border-primary rounded-xl p-6 shadow-2xl ${
                        isSpinning ? "animate-pulse" : ""
                      }`}
                    >
                      {symbol}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="slot-bet">Ставка</Label>
                    <Input
                      id="slot-bet"
                      type="number"
                      value={slotBet}
                      onChange={(e) => setSlotBet(Number(e.target.value))}
                      disabled={isSpinning}
                      className="bg-background border-primary/50"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={spinSlots}
                      disabled={isSpinning}
                      className="w-full bg-gradient-to-r from-secondary to-red-700 hover:from-red-700 hover:to-secondary text-white font-bold py-6 text-xl"
                    >
                      {isSpinning ? "Вращение..." : "КРУТИТЬ"}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 justify-center flex-wrap">
                  {[50, 100, 500, 1000].map((amount) => (
                    <Badge
                      key={amount}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-background border-primary"
                      onClick={() => setSlotBet(amount)}
                    >
                      {amount}₽
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roulette">
            <Card className="bg-gradient-to-br from-card via-card to-secondary/10 border-primary/50">
              <CardHeader>
                <CardTitle className="text-3xl text-center text-primary">🎡 Рулетка</CardTitle>
                <CardDescription className="text-center">Угадайте число и выиграйте x36!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-background to-secondary/20 rounded-lg border-2 border-primary/50">
                  <div
                    className={`w-48 h-48 rounded-full bg-gradient-to-br from-secondary via-red-800 to-primary border-8 border-primary flex items-center justify-center ${
                      isSpinningRoulette ? "animate-spin" : ""
                    }`}
                  >
                    <div className="text-6xl font-bold text-white">
                      {rouletteNumber !== null ? rouletteNumber : "?"}
                    </div>
                  </div>
                  {selectedNumber !== null && !isSpinningRoulette && (
                    <Badge className="bg-primary text-background px-6 py-2 text-lg">
                      Выбрано: {selectedNumber}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-10 gap-1 max-w-3xl mx-auto">
                  {ROULETTE_NUMBERS.map((num) => (
                    <Button
                      key={num}
                      onClick={() => setSelectedNumber(num)}
                      disabled={isSpinningRoulette}
                      variant={selectedNumber === num ? "default" : "outline"}
                      className={`aspect-square p-0 ${
                        selectedNumber === num
                          ? "bg-primary text-background"
                          : num === 0
                          ? "bg-green-700 text-white hover:bg-green-600"
                          : num % 2 === 0
                          ? "bg-card text-primary hover:bg-primary/20"
                          : "bg-secondary/80 text-white hover:bg-secondary"
                      }`}
                    >
                      {num}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div>
                    <Label htmlFor="roulette-bet">Ставка</Label>
                    <Input
                      id="roulette-bet"
                      type="number"
                      value={rouletteBet}
                      onChange={(e) => setRouletteBet(Number(e.target.value))}
                      disabled={isSpinningRoulette}
                      className="bg-background border-primary/50"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={spinRoulette}
                      disabled={isSpinningRoulette}
                      className="w-full bg-gradient-to-r from-secondary to-red-700 hover:from-red-700 hover:to-secondary text-white font-bold py-6 text-xl"
                    >
                      {isSpinningRoulette ? "Вращение..." : "КРУТИТЬ"}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 justify-center flex-wrap">
                  {[50, 100, 500, 1000].map((amount) => (
                    <Badge
                      key={amount}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-background border-primary"
                      onClick={() => setRouletteBet(amount)}
                    >
                      {amount}₽
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="bg-card border-primary/50">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primary">Пополнение счета</DialogTitle>
            <DialogDescription>Выберите способ оплаты и введите сумму</DialogDescription>
          </DialogHeader>

          <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "mir" | "youmoney")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-background">
              <TabsTrigger value="mir">Карта МИР</TabsTrigger>
              <TabsTrigger value="youmoney">ЮМани</TabsTrigger>
            </TabsList>

            <TabsContent value="mir" className="space-y-4">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-6 rounded-lg border border-primary/30">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="CreditCard" className="text-primary" size={32} />
                  <div>
                    <p className="text-sm text-muted-foreground">Карта МИР</p>
                    <p className="font-mono text-lg">2202 2032 4554 4491</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Переведите средства на указанную карту</p>
              </div>
            </TabsContent>

            <TabsContent value="youmoney" className="space-y-4">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-6 rounded-lg border border-primary/30">
                <div className="flex items-center gap-3 mb-4">
                  <Icon name="Wallet" className="text-primary" size={32} />
                  <div>
                    <p className="text-sm text-muted-foreground">ЮМани</p>
                    <p className="font-mono text-lg">4100 1193 6850 9857</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Переведите средства на указанный кошелек</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="payment-amount">Сумма пополнения (₽)</Label>
              <Input
                id="payment-amount"
                type="number"
                placeholder="Введите сумму"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="bg-background border-primary/50"
              />
            </div>

            <Button
              onClick={handleDeposit}
              className="w-full bg-gradient-to-r from-primary to-yellow-600 hover:from-yellow-600 hover:to-primary text-background font-bold py-6"
            >
              Подтвердить пополнение
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
