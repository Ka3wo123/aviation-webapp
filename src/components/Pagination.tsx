import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

interface PaginationProps {
    currentPage: number;
    totalPages: number | undefined;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageClick = (page: number) => {
        if (page >= 0 && totalPages && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <BootstrapPagination>
            <BootstrapPagination.First onClick={() => handlePageClick(1)} disabled={currentPage === 1} />
            <BootstrapPagination.Prev onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1} />
            {Array.from({ length: totalPages ? totalPages : 0 }, (_, i) => (
                <BootstrapPagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => handlePageClick(i + 1)}
                >
                    {i + 1}
                </BootstrapPagination.Item>
            ))}
            <BootstrapPagination.Next onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPages} />
            <BootstrapPagination.Last onClick={() => handlePageClick(totalPages || 0)} disabled={currentPage === totalPages} />
        </BootstrapPagination>
    );
};

export default Pagination;
