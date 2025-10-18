import { useState } from 'react';
import { NegotiableParameter } from '@/types/calculations';
import { REAL_ESTATE_DATA } from '@/constants/case-data';

export const useNegotiableParams = () => {
  const [negotiableParams, setNegotiableParams] = useState<NegotiableParameter[]>([
    {
      id: 'commission-rate',
      name: 'Commission Rate',
      currentValue: REAL_ESTATE_DATA.DEFAULT_COMMISSION_RATE * 100,
      minValue: REAL_ESTATE_DATA.MIN_COMMISSION_RATE * 100,
      maxValue: REAL_ESTATE_DATA.MAX_COMMISSION_RATE * 100,
      step: 0.1,
      unit: '%',
      description: 'Real estate agent commission rate'
    },
    {
      id: 'seller-concessions',
      name: 'Seller Concessions',
      currentValue: REAL_ESTATE_DATA.DEFAULT_SELLER_CONCESSIONS,
      minValue: REAL_ESTATE_DATA.MIN_SELLER_CONCESSIONS,
      maxValue: REAL_ESTATE_DATA.MAX_SELLER_CONCESSIONS,
      step: REAL_ESTATE_DATA.CONCESSIONS_STEP,
      unit: '$',
      description: 'Total seller concessions for repairs'
    }
  ]);

  const updateParameter = (id: string, value: number) => {
    setNegotiableParams(prev => prev.map(param =>
      param.id === id ? { ...param, currentValue: value } : param
    ));
  };

  return {
    negotiableParams,
    updateParameter
  };
};
