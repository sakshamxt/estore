import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '@/features/products/productSlice';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ShopPage = () => {
  const dispatch = useDispatch();
  const { products, isLoading, totalPages } = useSelector((state) => state.products);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 12, sortBy, order }));
  }, [dispatch, page, sortBy, order]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSortChange = (value) => {
    const [newSortBy, newOrder] = value.split(':');
    setSortBy(newSortBy);
    setOrder(newOrder);
    setPage(1); // Reset to first page on sort change
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold font-heading">Shop All</h1>
        <Select onValueChange={handleSortChange} defaultValue={`${sortBy}:${order}`}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt:desc">Newest</SelectItem>
            <SelectItem value="price:asc">Price: Low to High</SelectItem>
            <SelectItem value="price:desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      
      {!isLoading && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }} />
            </PaginationItem>
            {[...Array(totalPages).keys()].map(num => (
              <PaginationItem key={num}>
                <PaginationLink href="#" isActive={page === num + 1} onClick={(e) => { e.preventDefault(); handlePageChange(num + 1); }}>
                  {num + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ShopPage;