import Sidebar from '@/components/notes/Sidebar';
import MainContent from '@/components/notes/MainContent';

const NotesPage = () => {
    return (
        <div className="flex h-screen bg-secondary">
            <Sidebar/>
            <MainContent/>
        </div>
    );
};

export default NotesPage;
