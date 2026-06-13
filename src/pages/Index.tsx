import { useState } from "react";
import DiscordNav from "@/components/DiscordNav";
import DiscordSidebar from "@/components/DiscordSidebar";
import ChatArea from "@/components/ChatArea";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#36393f] text-white overflow-x-hidden">
      <DiscordNav mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="flex min-h-screen">
        <DiscordSidebar mobileSidebarOpen={mobileSidebarOpen} setMobileSidebarOpen={setMobileSidebarOpen} />

        <div className="flex-1 flex flex-col lg:flex-row">
          <ChatArea setMobileSidebarOpen={setMobileSidebarOpen} />

          {/* Боковая панель участников */}
          <div className="hidden xl:block w-60 bg-[#2f3136] p-4">
            <div className="mb-4">
              <h3 className="text-[#8e9297] text-xs font-semibold uppercase tracking-wide mb-2">В сети — 5</h3>
              <div className="space-y-2">
                {[
                  { name: "Катя 🏆", status: "Победила в розыгрыше", avatar: "К", color: "from-yellow-500 to-orange-500" },
                  { name: "Дима 😂", status: "Постит мемы", avatar: "Д", color: "from-green-500 to-teal-500" },
                  { name: "Саша", status: "Ждёт розыгрыша", avatar: "С", color: "from-purple-500 to-pink-500" },
                  { name: "Оля 🎉", status: "В сети", avatar: "О", color: "from-blue-500 to-indigo-500" },
                  { name: "Рома", status: "Смотрит стендап", avatar: "Р", color: "from-red-500 to-orange-500" },
                ].map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-[#36393f] cursor-pointer">
                    <div className={`w-8 h-8 bg-gradient-to-r ${user.color} rounded-full flex items-center justify-center relative`}>
                      <span className="text-white text-sm font-medium">{user.avatar}</span>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#3ba55c] border-2 border-[#2f3136] rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{user.name}</div>
                      <div className="text-[#b9bbbe] text-xs truncate">{user.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
