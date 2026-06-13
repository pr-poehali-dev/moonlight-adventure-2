import { useState } from "react";
import { Trophy, Copy, Check, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const REFERRAL_URL = "https://functions.poehali.dev/acab6c47-e091-4dc5-8cfc-71d8464ebf65";

const ReferralBlock = () => {
  const [refName, setRefName] = useState("");
  const [refEmail, setRefEmail] = useState("");
  const [refCode, setRefCode] = useState("");
  const [refLoading, setRefLoading] = useState(false);
  const [refResult, setRefResult] = useState<{ ref_code: string; points: number; message: string } | null>(null);
  const [refError, setRefError] = useState("");
  const [copied, setCopied] = useState(false);
  const [topUsers, setTopUsers] = useState<{ username: string; points: number; invites: number }[]>([]);
  const [topLoaded, setTopLoaded] = useState(false);

  const handleRegister = async () => {
    if (!refName.trim() || !refEmail.trim()) return;
    setRefLoading(true);
    setRefError("");
    try {
      const res = await fetch(REFERRAL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: refName.trim(), email: refEmail.trim(), ref_code: refCode.trim() }),
      });
      const data = JSON.parse(await res.text());
      if (data.status === "created" || data.status === "exists") {
        setRefResult(data);
        loadTop();
      } else {
        setRefError(data.error || "Ошибка регистрации");
      }
    } catch {
      setRefError("Ошибка соединения");
    } finally {
      setRefLoading(false);
    }
  };

  const loadTop = async () => {
    try {
      const res = await fetch(REFERRAL_URL + "?action=stats");
      const data = JSON.parse(await res.text());
      setTopUsers(data.top || []);
      setTopLoaded(true);
    } catch (e) {
      console.error(e);
    }
  };

  const copyRefLink = () => {
    if (!refResult) return;
    navigator.clipboard.writeText(`${window.location.origin}?ref=${refResult.ref_code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#2f3136] border border-[#5865f2] rounded-lg p-4 sm:p-6 mx-0">
      <div className="flex items-center gap-2 text-[#5865f2] text-xs font-semibold uppercase tracking-wide mb-3">
        <Link2 className="w-4 h-4" />
        <span>Реферальная программа</span>
      </div>

      <h2 className="text-white text-lg sm:text-xl font-bold mb-1">
        Приглашай друзей — копи очки 🎯
      </h2>
      <p className="text-[#b9bbbe] text-sm mb-4">
        За каждого приглашённого друга ты получаешь <span className="text-[#faa61a] font-semibold">+10 очков</span>. Больше очков — больше шансов в розыгрышах!
      </p>

      {!refResult ? (
        <div className="space-y-3">
          <Input
            placeholder="Твоё имя"
            value={refName}
            onChange={(e) => setRefName(e.target.value)}
            className="bg-[#40444b] border-[#40444b] text-white placeholder:text-[#72767d] focus:border-[#5865f2]"
          />
          <Input
            placeholder="Email"
            type="email"
            value={refEmail}
            onChange={(e) => setRefEmail(e.target.value)}
            className="bg-[#40444b] border-[#40444b] text-white placeholder:text-[#72767d] focus:border-[#5865f2]"
          />
          <Input
            placeholder="Реферальный код друга (необязательно)"
            value={refCode}
            onChange={(e) => setRefCode(e.target.value)}
            className="bg-[#40444b] border-[#40444b] text-white placeholder:text-[#72767d] focus:border-[#5865f2]"
          />
          {refError && <p className="text-red-400 text-sm">{refError}</p>}
          <Button
            onClick={handleRegister}
            disabled={refLoading || !refName || !refEmail}
            className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white font-medium"
          >
            {refLoading ? "Регистрация..." : "Получить реферальную ссылку"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#36393f] rounded-lg p-3 flex items-center gap-3">
            <div className="text-2xl">🎉</div>
            <div>
              <div className="text-white font-semibold text-sm">{refResult.message}</div>
              <div className="text-[#b9bbbe] text-xs">
                Твой код: <span className="text-[#faa61a] font-mono font-bold">{refResult.ref_code}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#40444b] rounded-lg p-3 flex items-center gap-2">
            <span className="text-[#b9bbbe] text-xs truncate flex-1 font-mono">
              {window.location.origin}?ref={refResult.ref_code}
            </span>
            <Button
              size="sm"
              onClick={copyRefLink}
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-3 shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#36393f] rounded-lg p-3 text-center">
              <div className="text-[#faa61a] text-xl font-bold">{refResult.points}</div>
              <div className="text-[#b9bbbe] text-xs">Очков</div>
            </div>
            <div className="bg-[#36393f] rounded-lg p-3 text-center">
              <div className="text-[#5865f2] text-xl font-bold">+10</div>
              <div className="text-[#b9bbbe] text-xs">За каждого друга</div>
            </div>
          </div>

          {!topLoaded && (
            <Button
              variant="ghost"
              onClick={loadTop}
              className="w-full text-[#b9bbbe] hover:text-white hover:bg-[#40444b] text-sm"
            >
              <Trophy className="w-4 h-4 mr-2" /> Посмотреть топ участников
            </Button>
          )}
          {topLoaded && topUsers.length > 0 && (
            <div>
              <div className="text-[#8e9297] text-xs font-semibold uppercase tracking-wide mb-2">🏆 Топ рефереров</div>
              <div className="space-y-1">
                {topUsers.map((u, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-[#36393f] rounded">
                    <span className="text-[#faa61a] font-bold text-sm w-5">{i + 1}</span>
                    <span className="text-white text-sm flex-1">{u.username}</span>
                    <span className="text-[#b9bbbe] text-xs">{u.invites} друзей</span>
                    <span className="text-[#faa61a] text-xs font-bold">{u.points} очков</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralBlock;
