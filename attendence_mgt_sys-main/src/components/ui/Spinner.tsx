import './Spinner.css';

export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    return (
        <div className={`spinner spinner-${size}`}>
            <div className="spinner-circle"></div>
        </div>
    );
}
