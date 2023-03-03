import { ControlProps, CSSObjectWithLabel, GroupBase, InputProps, NoticeProps } from "react-select";
import { OptionType } from ".";

export const reactSelectStyles = () => ({
    menu: (base: CSSObjectWithLabel, props: NoticeProps<OptionType, false, GroupBase<OptionType>>) => ({
      ...base,
      zIndex: '999',
      backgroundColor: '#374151',
    }),
    control: (base: CSSObjectWithLabel, state: ControlProps<OptionType, false, GroupBase<OptionType>>) => ({
      ...base,
      color: '#fefefe',
      borderRadius: 0,
      padding: '0',
      paddingTop: '0.9rem',
      boxShadow: "none",
      border: 'none',
      borderBottom: state.isFocused ? 'solid 2px #fb5607' : 'solid 2px #d1d5db',
      borderTopLeftRadius: '10px',
      borderTopRightRadius: '10px',
      cursor: 'pointer',
      backgroundColor: '#374151',
      "&:active": {
        borderBottom: 'solid 2px #d1d5db',
      },
      "&:hover": {
        outline: 'none'
      },
    }),
    loadingMessage: (base: CSSObjectWithLabel, props: NoticeProps<OptionType, false, GroupBase<OptionType>>) => ({
      ...base,
      color: '#fefefe',
    }),
    noOptionsMessage: (base: CSSObjectWithLabel, props: NoticeProps<OptionType, false, GroupBase<OptionType>>) => ({
      ...base,
      color: '#fefefe',
    }),
    option: (base: CSSObjectWithLabel, props: NoticeProps<OptionType, false, GroupBase<OptionType>>) => ({
      ...base,
      color: '#fefefe',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      "&:hover": {
        color: '#fb5607',
      },
    }),
    input: (base: CSSObjectWithLabel, state: InputProps<OptionType, false, GroupBase<OptionType>>) => ({
      ...base,
      color: '#fefefe',
    }),
    singleValue: (base: CSSObjectWithLabel, props: NoticeProps<OptionType, false, GroupBase<OptionType>>) => ({
      ...base,
      color: '#fefefe'
    }),
    placeholder: (base: CSSObjectWithLabel, props: NoticeProps<OptionType, false, GroupBase<OptionType>>) => ({
      ...base,
      color: '#fefefe'
    })
  })