
export const getImageUrl = (path: string | null | undefined) => {
    if (!path) return '/default-avatar.svg';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads')) {
        return `http://localhost:8005${path}`;
    }
    return path;
};
