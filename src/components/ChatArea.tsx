import { Bell, Gift, Hash, Laugh, Menu, Search, Star, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReferralBlock from "@/components/ReferralBlock";

interface Props {
  setMobileSidebarOpen: (v: boolean) => void;
}

const ChatArea = ({ setMobileSidebarOpen }: Props) => (
  <div className="flex-1 flex flex-col">
    {/* Заголовок чата */}
    <div className="">
      <Button
        variant="ghost"
        className="lg:hidden text-[#8e9297] hover:text-[#dcddde] hover:bg-[#40444b] p-1 mr-2"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>
      <Hash className="w-5 h-5 text-[#8e9297]" />
      <span className="text-white font-semibold"></span>
      <div className="w-px h-6 bg-[#40444b] mx-2 hidden sm:block"></div>
      <span className="text-[#8e9297] text-sm hidden sm:block"></span>
      <div className="">
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#b9bbbe] cursor-pointer hover:text-[#dcddde]" />
        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#b9bbbe] cursor-pointer hover:text-[#dcddde]" />
        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#b9bbbe] cursor-pointer hover:text-[#dcddde]" />
      </div>
    </div>

    {/* Сообщения чата */}
    <div className="flex-1 p-2 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto">
      {/* Приветственное сообщение */}
      <div className="">
        <div className="bg-slate-500"></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-white font-medium text-sm sm:text-base"></span>
            <span className="text-[#72767d] text-xs hidden sm:inline"></span>
          </div>
          <div className="text-[#dcddde] text-sm sm:text-base">
            <p className="mb-3 sm:mb-4"></p>
            <div className="">
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base"></h3>
              <ul className="space-y-1 text-xs sm:text-sm text-[#b9bbbe]">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Сообщение победителя */}
      <div className="">
        <div className="">
          <span className="text-white text-xs sm:text-sm font-medium">К</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="">
            <span className=""></span>
            <span className="text-[#72767d] text-xs hidden sm:inline">Сегодня в 12:05</span>
          </div>
          <div className="text-[#dcddde] mb-3 text-sm sm:text-base">
            Не могу поверить, что выиграла в розыгрыше!! Спасибо огромное! 🎉
          </div>

          {/* Карточка приза */}
          <div className="bg-[#2f3136] border border-[#faa61a] rounded-lg overflow-hidden w-full max-w-sm">
            <div className="h-16 sm:h-20 bg-gradient-to-r from-[#faa61a] to-[#f5733a] relative flex items-center justify-center">
              <span className="text-4xl">🎁</span>
            </div>
            <div className="pt-4 sm:pt-5 px-3 sm:px-4 pb-3 sm:pb-4">
              <div className="mb-3 sm:mb-4">
                <h3 className="text-white text-lg sm:text-xl font-bold mb-1">Катерина</h3>
                <div className="flex items-center gap-2 text-[#faa61a] text-xs sm:text-sm font-semibold">
                  <Trophy className="w-4 h-4" />
                  <span>Победитель розыгрыша недели!</span>
                </div>
              </div>
              <div className="mb-3 sm:mb-4">
                <div className="bg-[#36393f] rounded-lg p-2 sm:p-3">
                  <div className="flex items-center gap-2 text-[#dcddde] text-xs sm:text-sm">
                    <Gift className="w-4 h-4 text-[#faa61a]" />
                    <span>Приз: Airpods Pro 2-го поколения</span>
                  </div>
                </div>
              </div>
              <div className="flex border-b border-[#40444b] mb-3 sm:mb-4">
                <button className="px-3 sm:px-4 py-2 text-[#8e9297] text-xs sm:text-sm font-medium hover:text-[#dcddde]">
                  Профиль
                </button>
                <button className="px-3 sm:px-4 py-2 text-white text-xs sm:text-sm font-medium border-b-2 border-[#faa61a]">
                  Победа
                </button>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[#8e9297] text-xs font-semibold uppercase tracking-wide mb-2 sm:mb-3">
                  <span>Статус розыгрыша</span>
                </div>
                <div className="">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#faa61a] to-[#f5733a] rounded-lg flex items-center justify-center flex-shrink-0 text-2xl">
                    🏆
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-xs sm:text-sm mb-1">Я Люблю Юмор</div>
                    <div className="text-[#dcddde] text-xs sm:text-sm mb-1">Розыгрыш Airpods Pro</div>
                    <div className="text-[#b9bbbe] text-xs sm:text-sm mb-2">Еженедельный приз</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#faa61a] rounded-full animate-pulse"></div>
                      <span className="text-[#faa61a] text-xs font-medium">Победитель выбран!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ещё одно сообщение */}
      <div className="flex gap-2 sm:gap-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs sm:text-sm font-medium">Д</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-white font-medium text-sm sm:text-base"></span>
            <span className="text-[#72767d] text-xs hidden sm:inline"></span>
          </div>
          <div className="text-[#dcddde] text-sm sm:text-base"></div>
        </div>
      </div>

      {/* CTA блок */}
      <div className="">
        <div className="flex items-center gap-2 text-[#faa61a] text-xs font-semibold uppercase tracking-wide mb-3 sm:mb-4">
          <Star className="w-4 h-4" />
          <span>Следующий розыгрыш</span>
        </div>
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-2"></h2>
        <p className="text-[#b9bbbe] text-sm sm:text-base mb-4 sm:mb-6"></p>
        <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
          <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2 rounded text-sm font-medium"></Button>
          <Button variant="ghost" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] border border-[#40444b]"></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {[
            { icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Призы каждую неделю", desc: "Гаджеты, мерч и сюрпризы" },
            { icon: <Laugh className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Юмор без границ", desc: "Мемы, стендапы и конкурсы" },
            { icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Живое сообщество", desc: "Общение с единомышленниками" },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded hover:bg-[#36393f] transition-colors"
            >
              <div className="text-[#5865f2] mt-0.5">{feature.icon}</div>
              <div>
                <div className="text-white font-medium text-xs sm:text-sm">{feature.title}</div>
                <div className="text-[#b9bbbe] text-xs sm:text-sm">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Реферальная программа */}
      <ReferralBlock />
    </div>

    {/* Поле ввода */}
    <div className="p-2 sm:p-4">
      <div className="bg-[#40444b] rounded-lg px-3 sm:px-4 py-2 sm:py-3">
        <div className="text-[#72767d] text-xs sm:text-sm">Сообщение #розыгрыши</div>
      </div>
    </div>
  </div>
);

export default ChatArea;