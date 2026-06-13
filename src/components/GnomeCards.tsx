import { useState } from "react";
import { Sword, Zap, Star, ShoppingCart, PackageCheck, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

const GNOMES_URL = "https://functions.poehali.dev/27ba823b-0819-4db4-bb2b-3c6bdb2484ff";

const CARDS = [
  {
    type: 1,
    name: "Обычный гном",
    emoji: "🧙",
    cost: 1000,
    rate: 5,
    color: "from-slate-600 to-slate-500",
    border: "border-slate-500",
    badge: "bg-slate-600",
    rarity: "Обычный",
  },
  {
    type: 2,
    name: "Редкий гном",
    emoji: "🧙‍♂️",
    cost: 10000,
    rate: 30,
    color: "from-blue-700 to-blue-500",
    border: "border-blue-500",
    badge: "bg-blue-600",
    rarity: "Редкий",
  },
  {
    type: 3,
    name: "Легендарный гном",
    emoji: "🧙‍♀️",
    cost: 50000,
    rate: 80,
    color: "from-yellow-600 to-amber-400",
    border: "border-yellow-400",
    badge: "bg-yellow-600",
    rarity: "Легендарный",
  },
];

interface Props {
  userEmail: string;
  userPassword: string;
  userPoints: number;
  onPointsChange: (newPoints: number) => void;
}

interface CardStatus {
  card_type: number;
  name: string;
  emoji: string;
  rate_per_hour: number;
  pending: number;
}

const GnomeCards = ({ userEmail, userPassword, userPoints, onPointsChange }: Props) => {
  const [myCards, setMyCards] = useState<CardStatus[]>([]);
  const [totalPending, setTotalPending] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [buyLoading, setBuyLoading] = useState<number | null>(null);
  const [collectLoading, setCollectLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const showMsg = (text: string, ok: boolean) => {
    setMessage({ text, ok });
    setTimeout(() => setMessage(null), 3500);
  };

  const loadStatus = async () => {
    try {
      const res = await fetch(`${GNOMES_URL}?action=status&email=${encodeURIComponent(userEmail)}`);
      const data = JSON.parse(await res.text());
      if (data.cards) {
        setMyCards(data.cards);
        setTotalPending(data.total_pending);
        onPointsChange(data.points);
      }
      setLoaded(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBuy = async (cardType: number) => {
    setBuyLoading(cardType);
    try {
      const res = await fetch(`${GNOMES_URL}?action=buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password: userPassword, card_type: cardType }),
      });
      const data = JSON.parse(await res.text());
      if (data.status === "ok") {
        showMsg(data.message, true);
        onPointsChange(data.points_left);
        await loadStatus();
      } else {
        showMsg(data.error || "Ошибка покупки", false);
      }
    } catch {
      showMsg("Ошибка соединения", false);
    } finally {
      setBuyLoading(null);
    }
  };

  const handleCollect = async () => {
    setCollectLoading(true);
    try {
      const res = await fetch(`${GNOMES_URL}?action=collect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, password: userPassword }),
      });
      const data = JSON.parse(await res.text());
      if (data.status === "ok") {
        showMsg(data.message, true);
        onPointsChange(data.points);
        await loadStatus();
      } else {
        showMsg(data.error || "Ошибка сбора", false);
      }
    } catch {
      showMsg("Ошибка соединения", false);
    } finally {
      setCollectLoading(false);
    }
  };

  return (
    <div className="bg-[#2f3136] border border-[#faa61a] rounded-lg p-4 sm:p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[#faa61a] text-xs font-semibold uppercase tracking-wide">
          <Sword className="w-4 h-4" />
          <span>Гномы-добытчики</span>
        </div>
        <div className="flex items-center gap-1 bg-[#36393f] rounded px-2 py-1">
          <Star className="w-3 h-3 text-[#faa61a]" />
          <span className="text-white text-xs font-bold">{userPoints.toLocaleString()} очков</span>
        </div>
      </div>

      <h2 className="text-white text-lg sm:text-xl font-bold mb-1">Найми гнома и добывай очки ⛏️</h2>
      <p className="text-[#b9bbbe] text-sm mb-4">
        Карточки гномов добывают очки каждый час пока ты занят делами. Собирай вручную — и трать на призы!
      </p>

      {/* Сообщение */}
      {message && (
        <div className={`rounded-lg px-4 py-2 mb-4 text-sm font-medium ${message.ok ? "bg-[#3ba55c]/20 text-[#3ba55c] border border-[#3ba55c]/40" : "bg-red-500/20 text-red-400 border border-red-500/40"}`}>
          {message.text}
        </div>
      )}

      {/* Карточки магазина */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {CARDS.map((card) => {
          const owned = myCards.filter((c) => c.card_type === card.type).length;
          const canAfford = userPoints >= card.cost;
          return (
            <div
              key={card.type}
              className={`rounded-lg border ${card.border} bg-[#36393f] overflow-hidden`}
            >
              {/* Шапка */}
              <div className={`bg-gradient-to-r ${card.color} p-4 flex flex-col items-center`}>
                <span className="text-5xl mb-1">{card.emoji}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${card.badge}`}>
                  {card.rarity}
                </span>
              </div>

              {/* Тело */}
              <div className="p-3">
                <div className="text-white font-semibold text-sm mb-2 text-center">{card.name}</div>

                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8e9297] flex items-center gap-1"><Zap className="w-3 h-3" /> Добыча</span>
                    <span className="text-[#3ba55c] font-bold">+{card.rate} / час</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8e9297] flex items-center gap-1"><Coins className="w-3 h-3" /> Стоимость</span>
                    <span className="text-[#faa61a] font-bold">{card.cost.toLocaleString()} оч.</span>
                  </div>
                  {owned > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8e9297] flex items-center gap-1"><PackageCheck className="w-3 h-3" /> У тебя</span>
                      <span className="text-white font-bold">{owned} шт.</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleBuy(card.type)}
                  disabled={buyLoading !== null || !canAfford}
                  className={`w-full text-xs py-1.5 font-semibold ${
                    canAfford
                      ? "bg-[#5865f2] hover:bg-[#4752c4] text-white"
                      : "bg-[#40444b] text-[#72767d] cursor-not-allowed"
                  }`}
                >
                  {buyLoading === card.type ? "Покупка..." : canAfford ? "Купить за очки" : "Мало очков"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Мои гномы + сбор */}
      {!loaded ? (
        <Button
          variant="ghost"
          onClick={loadStatus}
          className="w-full text-[#b9bbbe] hover:text-white hover:bg-[#40444b] text-sm"
        >
          Показать моих гномов
        </Button>
      ) : myCards.length === 0 ? (
        <div className="text-center text-[#72767d] text-sm py-3">
          У тебя пока нет гномов. Купи первого выше! 👆
        </div>
      ) : (
        <div className="bg-[#36393f] rounded-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#8e9297] text-xs font-semibold uppercase tracking-wide">Мои гномы</span>
            <span className="text-[#faa61a] text-xs font-bold">
              Накоплено: +{totalPending} оч.
            </span>
          </div>
          <div className="space-y-2 mb-3">
            {myCards.map((c, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-[#2f3136] rounded">
                <span className="text-xl">{c.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium">{c.name}</div>
                  <div className="text-[#b9bbbe] text-xs">+{c.rate_per_hour} оч/ч</div>
                </div>
                <div className="text-[#faa61a] text-xs font-bold">+{c.pending} оч.</div>
              </div>
            ))}
          </div>
          <Button
            onClick={handleCollect}
            disabled={collectLoading || totalPending === 0}
            className="w-full bg-[#faa61a] hover:bg-[#f59e0b] text-[#202225] font-bold text-sm"
          >
            {collectLoading ? "Собираю..." : `⛏️ Собрать ${totalPending} очков`}
          </Button>
        </div>
      )}

      {/* Плашка: купить за деньги */}
      <div className="mt-3 bg-[#202225] rounded-lg p-3 flex items-center gap-3">
        <span className="text-2xl">💳</span>
        <div className="flex-1 min-w-0">
          <div className="text-white text-xs font-semibold">Купить за реальные деньги</div>
          <div className="text-[#72767d] text-xs">Оплата картой — скоро будет доступно</div>
        </div>
        <Button
          disabled
          size="sm"
          className="bg-[#40444b] text-[#72767d] text-xs cursor-not-allowed shrink-0"
        >
          Скоро
        </Button>
      </div>
    </div>
  );
};

export default GnomeCards;
