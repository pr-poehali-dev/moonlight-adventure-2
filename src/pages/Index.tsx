import { useState } from "react";
import {
  Shield,
  Zap,
  Gift,
  Clock,
  ArrowRight,
  Hash,
  Users,
  Mic,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Laugh,
  Star,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#36393f] text-white overflow-x-hidden">
      {/* Навигация */}
      <nav className="bg-[#2f3136] border-b border-[#202225] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#5865f2] rounded-full flex items-center justify-center text-lg">
              😂
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">Я Люблю Юмор</h1>
              <p className="text-xs text-[#b9bbbe] hidden sm:block">Юмор, розыгрыши и крутые призы</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Button variant="ghost" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b]">
              <Icon name="Send" size={16} className="mr-2" />
              Telegram
            </Button>
            <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2 rounded text-sm font-medium">
              Вступить
            </Button>
          </div>
          <Button
            variant="ghost"
            className="sm:hidden text-[#b9bbbe] hover:text-white hover:bg-[#40444b] p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pt-4 border-t border-[#202225]">
            <div className="flex flex-col gap-3">
              <Button variant="ghost" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] justify-start">
                <Icon name="Send" size={16} className="mr-2" />
                Telegram
              </Button>
              <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2 rounded text-sm font-medium">
                Вступить
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Макет в стиле Discord */}
      <div className="flex min-h-screen">
        {/* Боковая панель серверов */}
        <div className="hidden lg:flex w-[72px] bg-[#202225] flex-col items-center py-3 gap-2">
          <div className="w-12 h-12 bg-[#5865f2] rounded-2xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer text-xl">
            😂
          </div>
          <div className="w-8 h-[2px] bg-[#36393f] rounded-full"></div>
          {["🎁", "🏆", "😹", "🎉"].map((emoji, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-[#36393f] rounded-3xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer hover:bg-[#5865f2] text-lg"
            >
              {emoji}
            </div>
          ))}
        </div>

        {/* Основной контент */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Боковая панель каналов */}
          <div
            className={`${mobileSidebarOpen ? "block" : "hidden"} lg:block w-full lg:w-60 bg-[#2f3136] flex flex-col`}
          >
            <div className="p-4 border-b border-[#202225] flex items-center justify-between">
              <h2 className="text-white font-semibold text-base">Я Люблю Юмор</h2>
              <Button
                variant="ghost"
                className="lg:hidden text-[#b9bbbe] hover:text-white hover:bg-[#40444b] p-1"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 p-2">
              <div className="mb-4">
                <div className="flex items-center gap-1 px-2 py-1 text-[#8e9297] text-xs font-semibold uppercase tracking-wide">
                  <ArrowRight className="w-3 h-3" />
                  <span>Текстовые каналы</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  {["общий", "юмор", "розыгрыши", "победители"].map((channel) => (
                    <div
                      key={channel}
                      className="flex items-center gap-1.5 px-2 py-1 rounded text-[#8e9297] hover:text-[#dcddde] hover:bg-[#393c43] cursor-pointer"
                    >
                      <Hash className="w-4 h-4" />
                      <span className="text-sm">{channel}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 px-2 py-1 text-[#8e9297] text-xs font-semibold uppercase tracking-wide">
                  <ArrowRight className="w-3 h-3" />
                  <span>Голосовые каналы</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  {["Общий чат", "Стендап-вечер"].map((channel) => (
                    <div
                      key={channel}
                      className="flex items-center gap-1.5 px-2 py-1 rounded text-[#8e9297] hover:text-[#dcddde] hover:bg-[#393c43] cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                      <span className="text-sm">{channel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Пользователь */}
            <div className="p-2 bg-[#292b2f] flex items-center gap-2">
              <div className="w-8 h-8 bg-[#5865f2] rounded-full flex items-center justify-center text-base">
                😂
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">ЯЛЮ-Бот</div>
                <div className="text-[#b9bbbe] text-xs truncate">всегда в сети</div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-[#40444b]">
                  <Mic className="w-4 h-4 text-[#b9bbbe]" />
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-[#40444b]">
                  <Settings className="w-4 h-4 text-[#b9bbbe]" />
                </Button>
              </div>
            </div>
          </div>

          {/* Область чата */}
          <div className="flex-1 flex flex-col">
            {/* Заголовок чата */}
            <div className="h-12 bg-[#36393f] border-b border-[#202225] flex items-center px-4 gap-2">
              <Button
                variant="ghost"
                className="lg:hidden text-[#8e9297] hover:text-[#dcddde] hover:bg-[#40444b] p-1 mr-2"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Hash className="w-5 h-5 text-[#8e9297]" />
              <span className="text-white font-semibold">розыгрыши</span>
              <div className="w-px h-6 bg-[#40444b] mx-2 hidden sm:block"></div>
              <span className="text-[#8e9297] text-sm hidden sm:block">Участвуй — выигрывай крутые призы!</span>
              <div className="ml-auto flex items-center gap-2 sm:gap-4">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#b9bbbe] cursor-pointer hover:text-[#dcddde]" />
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#b9bbbe] cursor-pointer hover:text-[#dcddde]" />
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#b9bbbe] cursor-pointer hover:text-[#dcddde]" />
              </div>
            </div>

            {/* Сообщения чата */}
            <div className="flex-1 p-2 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto">
              {/* Приветственное сообщение */}
              <div className="flex gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#5865f2] rounded-full flex items-center justify-center flex-shrink-0 text-lg">
                  😂
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-white font-medium text-sm sm:text-base">ЯЛЮ-Бот</span>
                    <span className="text-[#72767d] text-xs hidden sm:inline">Сегодня в 10:00</span>
                  </div>
                  <div className="text-[#dcddde] text-sm sm:text-base">
                    <p className="mb-3 sm:mb-4">
                      <strong>Добро пожаловать в Я Люблю Юмор!</strong> Здесь весело, тут дают призы и каждый найдёт своё.
                    </p>
                    <div className="bg-[#2f3136] border-l-4 border-[#5865f2] p-3 sm:p-4 rounded">
                      <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Что тебя ждёт:</h3>
                      <ul className="space-y-1 text-xs sm:text-sm text-[#b9bbbe]">
                        <li>🎭 Лучшие мемы и юмор каждый день</li>
                        <li>🎁 Регулярные розыгрыши с крутыми призами</li>
                        <li>🏆 Конкурсы и испытания для подписчиков</li>
                        <li>💬 Живое общение с единомышленниками</li>
                        <li>🔔 Уведомления о новых розыгрышах первым</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Сообщение победителя */}
              <div className="flex gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-medium">К</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-white font-medium text-sm sm:text-base">Катя 🏆</span>
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

                        <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-[#36393f] rounded-lg">
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
                    <span className="text-white font-medium text-sm sm:text-base">Дима 😂</span>
                    <span className="text-[#72767d] text-xs hidden sm:inline">Сегодня в 12:08</span>
                  </div>
                  <div className="text-[#dcddde] text-sm sm:text-base">
                    Вы видели мем про понедельник? 😹 Надо добавить в #юмор!
                  </div>
                </div>
              </div>

              {/* CTA блок */}
              <div className="bg-[#2f3136] border border-[#202225] rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 text-[#faa61a] text-xs font-semibold uppercase tracking-wide mb-3 sm:mb-4">
                  <Star className="w-4 h-4" />
                  <span>Следующий розыгрыш</span>
                </div>

                <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">
                  Вступай — участвуй — побеждай! 🎉
                </h2>
                <p className="text-[#b9bbbe] text-sm sm:text-base mb-4 sm:mb-6">
                  Каждую неделю разыгрываем крутые призы среди участников сообщества. Чем активнее — тем больше шансов!
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
                  <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2 rounded text-sm font-medium">
                    🎁 Участвовать в розыгрыше
                  </Button>
                  <Button variant="ghost" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] border border-[#40444b]">
                    💬 Вступить в сообщество
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {[
                    {
                      icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5" />,
                      title: "Призы каждую неделю",
                      desc: "Гаджеты, мерч и сюрпризы",
                    },
                    {
                      icon: <Laugh className="w-4 h-4 sm:w-5 sm:h-5" />,
                      title: "Юмор без границ",
                      desc: "Мемы, стендапы и конкурсы",
                    },
                    {
                      icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
                      title: "Живое сообщество",
                      desc: "Общение с единомышленниками",
                    },
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
            </div>

            {/* Поле ввода */}
            <div className="p-2 sm:p-4">
              <div className="bg-[#40444b] rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                <div className="text-[#72767d] text-xs sm:text-sm">Сообщение #розыгрыши</div>
              </div>
            </div>
          </div>

          {/* Боковая панель участников */}
          <div className="hidden xl:block w-60 bg-[#2f3136] p-4">
            <div className="mb-4">
              <h3 className="text-[#8e9297] text-xs font-semibold uppercase tracking-wide mb-2">В сети — 5</h3>
              <div className="space-y-2">
                {[
                  {
                    name: "Катя 🏆",
                    status: "Победила в розыгрыше",
                    avatar: "К",
                    color: "from-yellow-500 to-orange-500",
                  },
                  { name: "Дима 😂", status: "Постит мемы", avatar: "Д", color: "from-green-500 to-teal-500" },
                  { name: "Саша", status: "Ждёт розыгрыша", avatar: "С", color: "from-purple-500 to-pink-500" },
                  { name: "Оля 🎉", status: "В сети", avatar: "О", color: "from-blue-500 to-indigo-500" },
                  { name: "Рома", status: "Смотрит стендап", avatar: "Р", color: "from-red-500 to-orange-500" },
                ].map((user, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-[#36393f] cursor-pointer">
                    <div
                      className={`w-8 h-8 bg-gradient-to-r ${user.color} rounded-full flex items-center justify-center relative`}
                    >
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
