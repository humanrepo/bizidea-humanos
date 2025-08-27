import React from 'react';
import ApiTest from './ApiTest';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                            Transformez vos{' '}
                            <span className="text-blue-600">idées</span>{' '}
                            en{' '}
                            <span className="text-blue-600">business</span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Bizidea vous accompagne dans la création et le développement de votre entreprise 
                            avec des outils intelligents et une plateforme tout-en-un.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a 
                                href="/signup" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Commencer gratuitement
                            </a>
                            <a 
                                href="/demo" 
                                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
                            >
                                Voir la démo
                            </a>
                        </div>
                    </div>

                    {/* API Test Section */}
                    <div className="mt-16 max-w-4xl mx-auto">
                        <ApiTest />
                    </div>

                    {/* Hero Image Placeholder */}
                    <div className="mt-16 relative">
                        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-4xl mx-auto">
                            <div className="bg-gray-100 rounded-lg h-64 sm:h-96 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 text-lg">Interface de la plateforme Bizidea</p>
                                    <p className="text-gray-400 text-sm mt-2">Capture d'écran à venir</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Pourquoi choisir Bizidea ?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Une plateforme complète pour transformer vos idées en entreprises prospères
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Démarrage rapide</h3>
                            <p className="text-gray-600">
                                Lancez votre projet en quelques minutes avec nos templates et outils prêts à l'emploi.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics avancés</h3>
                            <p className="text-gray-600">
                                Suivez vos performances et prenez des décisions éclairées grâce à nos tableaux de bord.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-200">
                            <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaboration</h3>
                            <p className="text-gray-600">
                                Travaillez en équipe efficacement avec nos outils de collaboration intégrés.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Prêt à transformer vos idées ?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Rejoignez des milliers d'entrepreneurs qui font confiance à Bizidea pour développer leur business.
                    </p>
                    <a 
                        href="/signup" 
                        className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
                    >
                        Commencer maintenant
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Home;