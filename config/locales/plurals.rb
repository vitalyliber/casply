{:ru =>
  { :i18n =>
    { :plural =>
      { :keys => [:one, :few, :other],
        :rule => lambda { |n|
          if n == 1
            :one
          else
            if [2, 3, 4].include?(n % 10) &&
              ![12, 13, 14].include?(n % 100) &&
              ![22, 23, 24].include?(n % 100)
              :few
            else
              :other
            end
          end
        }
      }
    }
  }
}