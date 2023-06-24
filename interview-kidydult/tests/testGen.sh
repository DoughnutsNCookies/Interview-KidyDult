#!/bin/bash

num_users=100
conversations=10000
char_range_min=1
char_range_max=10

users=()

for ((i=1; i<=num_users; i++))
do
    users+=("user$i")
done

for ((i=0; i<conversations; i++))
do
    user=${users[$((RANDOM % num_users))]}
    count=$((RANDOM % (char_range_max - char_range_min + 1) + char_range_min))
    chars=()
    
    for ((j=0; j<count; j++))
    do
        chars+=($(printf "\x$(printf %x $((RANDOM % 26 + 97)))"))
    done
    
    echo "<$user> ${chars[*]}"
done
