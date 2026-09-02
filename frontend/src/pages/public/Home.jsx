import Hero from '../../components/home/Hero';
import About from '../../components/home/About';
import Skills from '../../components/home/Skills';
import Projects from '../../components/home/Projects';
import Experience from '../../components/home/Experience';
import Contact from '../../components/home/Contact';

const Home = () => {
    return (
        <>
            {/* <div className="bg-purple-600 text-white p-8 text-center text-3xl font-bold rounded-xl m-8">
                ✅ TAILWIND IS WORKING!
            </div> */}
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
        </>
    );
};

export default Home;