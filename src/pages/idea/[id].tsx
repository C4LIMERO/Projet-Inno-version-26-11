import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import ideaService from '../../services/IdeaService';
import { Idea } from '../../types';
import Layout from '../../components/Layout';
import IdeaStats from '../../components/IdeaDetail/IdeaStats';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface IdeaPageProps {
  idea: Idea;
}

interface IdeaPathParams extends ParsedUrlQuery {
  id: string;
}

const IdeaPage: NextPage<IdeaPageProps> = ({ idea }) => {
  if (!idea) {
    return (
      <Layout>
        <Head>
          <title>Idée non trouvée | Boîte à idées Centrale Méditerranée</title>
        </Head>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold text-gray-700">Idée non trouvée</h1>
          <p className="text-gray-500 mt-3">Désolé, l'idée que vous cherchez n'existe pas.</p>
        </div>
      </Layout>
    );
  }

  const authorName = idea.isAnonymous ? 'Anonyme' : `${idea.author.firstName} ${idea.author.lastName}`;

  return (
    <Layout>
      <Head>
        <title>{`${idea.title} | Boîte à idées Centrale Méditerranée`}</title>
        <meta name="description" content={idea.description.substring(0, 160)} />
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <article className="bg-white rounded-lg overflow-hidden md:border md:border-gray-100 shadow-sm">
          <div className="p-6 sm:p-8 md:p-12">
            <header className="mb-10">
              <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-5 leading-tight">{idea.title}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-6 space-y-2 sm:space-y-0">
                <div>
                  <span>Proposée par : <strong className="font-medium text-gray-700">{authorName}</strong></span>
                </div>
                <div>
                  <span className="font-normal">Soumis le : {format(new Date(idea.createdAt), 'd MMMM yyyy', { locale: fr })}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <div className="flex items-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium text-lg">{idea.contributors.length}</span>
                  <span className="ml-1">Contributeurs</span>
                </div>
                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 items-center">
                    {idea.tags.map(tag => (
                      <span key={tag} className="text-xs font-medium text-gray-600 border border-gray-300 px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${idea.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    idea.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                  }`}>
                  {idea.status === 'Completed' ? 'Terminé' : idea.status === 'In Progress' ? 'En cours' : 'Proposé'}
                </span>
              </div>
            </header>

            <section className="prose prose-sm prose-slate max-w-none text-gray-600 mb-10 md:mb-12">
              <p className="whitespace-pre-wrap">{idea.description}</p>
            </section>

            <hr className="my-10 md:my-12 border-gray-100" />

            <section>
              <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-6">Détails</h2>
              <IdeaStats idea={idea} />
            </section>
          </div>
        </article>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths<IdeaPathParams> = async () => {
  const ideas = ideaService.getAllIdeas();
  const paths = ideas.map(idea => ({
    params: { id: idea.id.toString() },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<IdeaPageProps, IdeaPathParams> = async (context) => {
  const { id } = context.params!;
  const idea = ideaService.getIdeaById(id as string);

  if (!idea) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      idea,
    },
  };
};

export default IdeaPage; 