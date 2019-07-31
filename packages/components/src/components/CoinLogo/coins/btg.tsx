import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg``;
const Circle = styled.circle``;
const Path = styled.path``;

interface SvgProps {
    width: number;
    height: number;
}

const SvgComponent = (props: SvgProps) => (
    <Svg viewBox="0 0 256 256" {...props}>
        <Path
            d="M128,0 C198.692448,0 256,57.307552 256,128 C256,198.692448 198.692448,256 128,256 C57.307552,256 0,198.692448 0,128 C0,57.307552 57.307552,0 128,0 Z M128,59 C166.659932,59 198,90.3400675 198,129 C198,167.659932 166.659932,199 128,199 C89.3400675,199 58,167.659932 58,129 C58,90.3400675 89.3400675,59 128,59 Z"
            fill="#F0A835"
        />
        <Circle fill="#FFFFFF" fill-rule="nonzero" cx="128" cy="128" r="73" />
        <Path
            d="M128,194 C92.1014913,194 63,164.898509 63,129 C63,93.1014913 92.1014913,64 128,64 C163.898509,64 193,93.1014913 193,129 C193,146.239072 186.151805,162.772076 173.961941,174.961941 C161.772076,187.151805 145.239072,194 128,194 L128,194 Z M134,133 L123,133 L123,157 L132,157 C134.833,157 152,157.5 152,144 C152,133.333 138.333,133 134,133 Z M147,111 C147,101.5 134.833,100 133,100 L123,100 L123,122 L132,122 C135,122 147,120.5 147,111 Z M131,186.923 L131,170 L122,170 L122,186.692 C123.993454,186.89672 125.996061,186.99952 128,187 C129.006,187 130.006,186.974333 131,186.923 Z M70,129 C70.0022873,154.485871 86.6354493,176.986483 111,184.463 L111,170 L90,170 C87.333,170 87.8,166.6 89,161 C89.989,156.364 94,157 94,157 L101,157 C102.656854,157 104,155.656854 104,154 L104,103 C104,101.343146 102.656854,100 101,100 L90,100 C88.5,100 88,99.667 88,98 L88,90 C88,88.167 89.885,88 91,88 L111,88 L111,73.537 C86.6354493,81.0135173 70.0022873,103.514129 70,129 Z M122,71.308 L122,88 L131,88 L131,71.077 C130.006,71.0256667 129.006,71 128,71 C125.996061,71.0004796 123.993454,71.1032801 122,71.308 L122,71.308 Z M141,72.481 L141,88 C141,88 168,88.833 168,110 C167.978015,116.272193 164.523942,122.028981 159,125 C159,125 174,126 174,144 C174,162 161.666,170 142,170 C142.138,175.964 142.047,183.065 142.012,185.285 C168.044558,178.801526 186.233465,155.31059 185.992794,128.483895 C185.752123,101.6572 167.144689,78.4963755 141,72.481 L141,72.481 Z"
            fill="#192A68"
        />
    </Svg>
);

export default SvgComponent;
